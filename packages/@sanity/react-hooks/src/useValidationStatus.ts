import React from 'react'
import {Marker} from '@sanity/types'
import documentStore from 'part:@sanity/base/datastore/document'
import {useObservable} from './utils/useObservable'

interface ValidationStatus {
  isValidating: boolean
  markers: Marker[]
}

const INITIAL: ValidationStatus = {markers: [], isValidating: false}

export function useValidationStatus(publishedDocId: string, docTypeName: string): ValidationStatus {
  const stream = React.useMemo(() => {
    return documentStore.pair.validation(publishedDocId, docTypeName)
  }, [publishedDocId, docTypeName])

  const value = useObservable(stream, INITIAL)

  return value
}
