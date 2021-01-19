/* eslint-disable camelcase */

import {isValidationMarker, Marker} from '@sanity/types'
import {Box, Flex, Stack, Text} from '@sanity/ui'
import React from 'react'
import {FormFieldValidationStatus} from './FormFieldValidationStatus'

export interface FormFieldHeaderTextProps {
  /**
   * @beta
   */
  __unstable_markers?: Marker[]
  description?: React.ReactNode
  /**
   * The unique ID used to target the actual input element
   */
  htmlFor?: string
  title?: React.ReactNode
}

export function FormFieldHeaderText(props: FormFieldHeaderTextProps) {
  const {description, htmlFor, title, __unstable_markers: markers = []} = props
  const validationMarkers = markers.filter(isValidationMarker)
  const hasValidations = validationMarkers.length > 0

  return (
    <Stack space={2}>
      <Flex>
        <Text as="label" htmlFor={htmlFor} weight="semibold" size={1}>
          {title || <em>Untitled</em>}
        </Text>

        {hasValidations && (
          <Box marginLeft={2}>
            <FormFieldValidationStatus fontSize={1} __unstable_markers={markers} />
          </Box>
        )}
      </Flex>

      {description && (
        <Text muted size={1}>
          {description}
        </Text>
      )}
    </Stack>
  )
}
