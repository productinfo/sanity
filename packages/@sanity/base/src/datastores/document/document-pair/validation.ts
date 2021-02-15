import {isEqual} from 'lodash'
import {
  distinctUntilChanged,
  map,
  mapTo,
  mergeMap,
  publishReplay,
  refCount,
  scan,
  switchMap,
} from 'rxjs/operators'
import {concat, from, Observable, of, timer} from 'rxjs'
import schema from 'part:@sanity/base/schema'
import {validateDocument} from '@sanity/validation'
import {memoize} from '../utils/createMemoizer'
import {IdPair} from '../types'
import {editState} from './editState'

type Marker = any
const EMPTY_ARRAY = []
function getValidationMarkers(draft, published): Observable<Marker[]> {
  const doc = draft || published
  if (!doc || !doc._type) {
    return of(EMPTY_ARRAY)
  }
  return from(validateDocument(doc, schema) as Promise<Marker[]>)
}

export interface ValidationStatus {
  isValidating: boolean
  markers: Marker[]
}

const INITIAL_VALIDATION_STATUS: ValidationStatus = {isValidating: true, markers: []}
function validateEditState(_editState: any) {
  return getValidationMarkers(_editState.draft, _editState.published).pipe(
    map((markers) => ({
      markers,
    }))
  )
}

export const validation = memoize(
  (idPair: IdPair, typeName: string) => {
    return concat(
      of(INITIAL_VALIDATION_STATUS),
      editState(idPair, typeName).pipe(
        switchMap((_editState) =>
          concat<Partial<ValidationStatus>>(
            of({isValidating: true}),
            timer(300).pipe(mapTo(_editState), mergeMap(validateEditState)),
            of({isValidating: false})
          )
        ),
        scan(
          (prev, validationStatus) => ({...prev, ...validationStatus}),
          INITIAL_VALIDATION_STATUS
        ),
        scan((prev, next) => {
          if (isEqual(prev.markers, next.markers)) {
            next.markers = prev.markers
          }

          return next
        }),
        distinctUntilChanged(
          (prev, next) => prev.isValidating === next.isValidating && prev.markers === next.markers
        )
      )
    ).pipe(publishReplay(1), refCount())
  },
  (idPair) => idPair.publishedId
)
