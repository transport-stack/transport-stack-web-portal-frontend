import React, { useEffect, useState } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import './DatePickerComponent.scss'
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { setSelectionRange } from '@testing-library/user-event/dist/utils';
const DatePickerComponent = ({ control, name, rules, placeholderText, defaultValue, required }) => {
    const [selectedDate, setSelectedDate] = useState(defaultValue);

    const [isFocused, setIsFocused] = useState(false);
    const value = useWatch({ control, name });
    // const handleClear = () => {
    //     setSelectedDate(null);
    // }
    useEffect(() => {
        setSelectedDate(defaultValue);
    }, [defaultValue])
    return (
        <FormGroup className='mb-3 mt-3 form-floating custom-datepicker'>
            <FormLabel className={`floating-label ${isFocused || value !== null || selectedDate !== '' ? 'focused' : ''}`}>{placeholderText} {required && <span className='star'>*</span>}</FormLabel>
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <DatePicker
                            onChange={(date) => { setSelectedDate(date); field.onChange(date) }}
                            selected={selectedDate}
                            onFocus={() => { setIsFocused(true) }}
                            onBlur={() => setIsFocused(false)}
                            // onKeyDown={(e) => e.preventDefault()}
                            dateFormat="dd/MM/yyyy"
                            customInput={<FormControl isInvalid={!!error} />}
                        />
                        {/* {value && <button type="button" className='clear-button' onClick={handleClear} aria-label='clear date'>x</button>} */}
                        {error && <span className="is-invalid-border-only">{error.message}</span>}
                    </>
                )} />
        </FormGroup >
    )
}

export default DatePickerComponent
