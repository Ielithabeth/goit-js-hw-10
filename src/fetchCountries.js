export function fetchCountries (name) {
    // https://restcountries.com/v3.1/name/Ukraine?fields=name,capital,flag,languages
    const BASE_URL = 'https://restcountries.com/v3.1/name';
    const FIELDS = 'fields=name,capital,flags,population,languages'
    let controller = new AbortController();
    
    return fetch(`${BASE_URL}/${name}?${FIELDS}`, { signal: controller.signal })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        };

        return response.json();
    });
}
