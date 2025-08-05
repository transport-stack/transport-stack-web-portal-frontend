import React from 'react'
import { FormGroup, FormLabel } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { MultiSelect } from 'react-multi-select-component';
import './MultiSelectComponent.scss'
const MultiSelectComponent = ({ control, name, label, rules, defaultValue, options, required, onChange }) => {
    return (
        <Controller
            name={name}
            control={control}
            // defaultValue={defaultValue}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <FormGroup className='mb-3'>
                    <FormLabel>{label} {required && <span className='star'>*</span>}</FormLabel>
                    <MultiSelect {...field}
                        options={options}
                        value={field.value || []}
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions); // Update the form value
                          onChange?.(selectedOptions); // Call the custom onChange handler if provided
                        }}
                        className="custom-multi-select"
                        hasSelectAll="true"
                        disableSearch="true" />
                    {error && <span className="is-invalid-border-only">{error.message}</span>}
                </FormGroup >
            )}>
        </Controller >
    )
}

export default MultiSelectComponent
