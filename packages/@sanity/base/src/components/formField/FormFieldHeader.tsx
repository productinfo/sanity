/* eslint-disable camelcase */

import React from 'react'
import {Box, Flex} from '@sanity/ui'
import {Marker} from '@sanity/types'
import {FieldPresence, FormFieldPresence} from '../../presence'
import {FormFieldHeaderText} from './FormFieldHeaderText'

export interface FormFieldHeaderProps {
  /**
   * @beta
   */
  __unstable_markers?: Marker[]
  /**
   * @beta
   */
  __unstable_presence?: FormFieldPresence[]
  description?: React.ReactNode
  /**
   * The unique ID used to target the actual input element
   */
  htmlFor?: string
  title?: React.ReactNode
}

export function FormFieldHeader(props: FormFieldHeaderProps) {
  const {
    __unstable_markers: markers,
    __unstable_presence: presence,
    description,
    htmlFor,
    title,
  } = props

  return (
    <Flex align="flex-end">
      <Box flex={1} paddingY={2}>
        <FormFieldHeaderText
          __unstable_markers={markers}
          description={description}
          htmlFor={htmlFor}
          title={title}
        />
      </Box>

      {presence && presence.length > 0 && (
        <Box>
          <FieldPresence maxAvatars={4} presence={presence} />
        </Box>
      )}
    </Flex>
  )
}
