import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useGoogleMaps } from './GoogleMapLoader';

export default function AddressAutocomplete({ 
  value = "",
  onPlaceSelected, 
  placeholder = "Enter address...",
  className = ""
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(value || '');
  const { isLoaded } = useGoogleMaps();
  const isSelectingRef = useRef(false);

  // Update display value when prop changes
  useEffect(() => {
    if (!isSelectingRef.current && value !== displayValue) {
      setDisplayValue(value || '');
      if (inputRef.current) {
        inputRef.current.value = value || '';
      }
    }
  }, [value]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google?.maps?.places) {
      return;
    }

    try {
      // Create autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' }
      });

      // Listen for place selection
      const listener = autocompleteRef.current.addListener('place_changed', () => {
        isSelectingRef.current = true;
        const place = autocompleteRef.current.getPlace();
        
        if (place && place.geometry && place.formatted_address) {
          const selectedAddress = place.formatted_address;
          
          // Update display value and input
          setDisplayValue(selectedAddress);
          if (inputRef.current) {
            inputRef.current.value = selectedAddress;
          }
          
          // Create location object
          const location = {
            address: selectedAddress,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            place_id: place.place_id,
          };
          
          // Notify parent
          if (onPlaceSelected) {
            onPlaceSelected(location);
          }
        }
        
        setTimeout(() => {
          isSelectingRef.current = false;
        }, 100);
      });

      // Prevent autocomplete from clearing input on blur
      if (inputRef.current) {
        inputRef.current.addEventListener('blur', (e) => {
          setTimeout(() => {
            if (inputRef.current && displayValue) {
              inputRef.current.value = displayValue;
            }
          }, 200);
        });
      }

      return () => {
        if (listener) {
          window.google.maps.event.removeListener(listener);
        }
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    } catch (error) {
      console.error('Error initializing Google Maps Autocomplete:', error);
    }
  }, [isLoaded]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
  };

  if (!isLoaded) {
    return (
      <div className="relative">
        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          disabled
          value=""
          className={`pl-10 ${className}`}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none z-10" />
      <Input
        ref={inputRef}
        defaultValue={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`pl-10 ${className}`}
        autoComplete="off"
      />
    </div>
  );
}