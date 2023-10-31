import { LOCATION_ERRORS, ServerErrors } from './constants.ts';
export const validationTexts: any = {
    requireMap: 'Privalote pasirinkti vietą žemėlapyje',
    requirePhotos: 'Privalote įkelti nuotrauką',
    userDeniedLocation: 'Turite leisti nustatyti jūsų buvimo vietą',
    requireSpeciesType: 'Privalote pasirinkti bent vieną rūšių tipą',
    requireText: 'Privalomas laukelis',
    requireSelect: 'Privalote pasirinkti',
    badEmailFormat: 'Blogas el. pašto adresas',
    badPhoneFormat: 'Blogai įvestas telefono numeris',
    tooFrequentRequest: 'Nepavyko, per dažna užklausa prašome pabandyti veliau ',
    passwordsDoNotMatch: 'Slaptažodžiai nesutampa',
    error: 'Įvyko nenumatyta klaida, prašome pabandyti vėliau',
    validFirstName: 'Įveskite taisyklingą vardą',
    validLastName: 'Įveskite taisyklingą pavardę',
    [ServerErrors.WRONG_PASSWORD]: 'Blogas elektroninis paštas arba slaptažodis',
    [ServerErrors.USER_NOT_FOUND]: 'Naudotojo su tokiu el. paštu nėra',
    badFileTypes: 'Blogi failų tipai',
    fileSizesExceeded: 'Viršyti failų dydžiai',
    personalCode: 'Neteisingas asmens kodo formatas',
    positiveNumber: 'Reikšmė turi būti didesnė už nulį',
    requireFiles: 'Privalote įkelti dokumentus',
    atLeastOneColumn: 'Turi būti pasirinktas bent vienas stulpelis',
};

export const LOCATION_ERROR_MESSAGES = {
    [LOCATION_ERRORS.NO_ERROR]: null,
    [LOCATION_ERRORS.POINT_NOT_FOUND]: 'Nepavyko nustatyti vietos - nerastos koordinatės',
    [LOCATION_ERRORS.WATER_BODY_NOT_FOUND]: 'Nepavyko nustatyti vietos - neteisingos koordinatės',
    [LOCATION_ERRORS.API_ERROR]: 'Nepavyko nustatyti vietos - serverio klaida',
    [LOCATION_ERRORS.GEOLOCATION_NOT_SUPPORTE]:
        'Nepavyko nustatyti vietos - telefonas nepalaiko šio funkcionalumo',
    [LOCATION_ERRORS.PERMISSION_REQUIRED]:
        'Nepavyko nustatyti vietos - nesuteiktas leidimas nustatyti buvmo vietą',
    [LOCATION_ERRORS.OTHER]: 'Nepavyko nustatyti vietos',
};

export const titles = {
    login: 'Verslinės žvejybos aplikacija',
    selectProfile: 'Pasirinkite paskyrą',
};

export const descriptions = {
    login: 'Žvejybos padalinių žvejybos žurnalas',
};

export const buttonLabels = {
    eGate: 'Prisijungti per el. valdžios vartus',
    login: 'Prisijungti',
    loginWithPassword: 'Prisijungti su slaptažodžiu',
    logout: 'Atsijungti',
};
