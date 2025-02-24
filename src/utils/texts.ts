import { EventTypes, RoleTypes, ServerErrors } from './constants';
export const validationTexts = {
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
  [ServerErrors.TOO_MANY_TOOLS]: 'Galimos tik vieno  tipo  įrankių grupės',
  [ServerErrors.NO_TOOLS_IN_STORAGE]: 'Neturite įrankių sandelyje',
  [ServerErrors.TOOL_WITH_THIS_SEAL_NUMBER_ALREADY_EXISTS]:
    'Įrankis su šiuo plombos numeriu jau egzistuoja',
  [ServerErrors.FISH_MUST_BE_WEIGHTED]:
    'Sužvejotos žuvys turi būti pasvertos krante, prieš užbaigiant žvejybą',
  [ServerErrors.LOCATION_NOT_FOUND]: 'Nepavyo nustatyti vandens telkinio pagal įvestas koordinates',
  [ServerErrors.FISH_ALREADY_WEIGHTED]: 'Žuvis krante jau buvo pasverta',
  badFileTypes: 'Blogi failų tipai',
  fileSizesExceeded: 'Viršyti failų dydžiai',
  personalCode: 'Neteisingas asmens kodo formatas',
  positiveNumber: 'Reikšmė turi būti didesnė už nulį',
  requireFiles: 'Privalote įkelti dokumentus',
  atLeastOneColumn: 'Turi būti pasirinktas bent vienas stulpelis',
  profileUpdated: 'Profilis atnaujintas',
  fishingFinished: 'Žvejyba pabaigta',
  failedToSetLocation: 'Nepavyko nustatyti lokacijos',
  mustAllowToSetCoordinates: 'Privalote leisti nustatyti kordinates',
  [ServerErrors.AUTH_USER_EXISTS]: 'Asmuo su tokiu asmens kodu jau registruotas.',
};

export const titles = {
  login: 'Verslinės žvejybos aplikacija',
  selectProfile: 'Pasirinkite paskyrą',
  profile: 'Profilis',
  newMember: 'Naujas narys',
  newTool: 'Naujas įrankis',
};

export const subTitles = {
  login: 'Žvejybos padalinių žvejybos žurnalas',
};

export const buttonLabels = {
  eGate: 'Prisijungti per el. valdžios vartus',
  login: 'Prisijungti',
  loginWithPassword: 'Prisijungti su slaptažodžiu',
  logout: 'Atsijungti',
  profiles: 'Profiliai',
  saveChanges: 'Saugoti pakeitimus',
  save: 'Saugoti',
  newTool: 'Naujas įrankis',
  newMember: 'Naujas narys',
  addMember: 'Pridėti narį',
  cancel: 'Atšaukti',
  delete: 'Pašalinti',
  addTool: 'Pridėti įrankį',
  startFishing: 'Pradėti žvejybą',
  endFishing: 'Pabaigti žvejybą',
  cantFishing: 'Neplaukiu žvejoti',
  badWeather: 'Blogos oro sąlygos',
  sick: 'Sergu',
  other: 'Kita',
  confirm: 'Patvirtinti',
};

export const inputLabels = {
  firstName: 'Vardas',
  lastName: 'Pavardė',
  phone: 'Telefonas',
  email: 'El. pašto adresas',
  personalCode: 'Asmens kodas',
  role: 'Teisė',
  lat: 'Ilguma',
  lng: 'Platuma',
  location: 'Telkinio pavadinimas arba baro nr.',
};

export const deleteDescriptionFirstPart = {
  delete: 'Ar esate tikri, kad norite pašalinti',
};

export const deleteDescriptionSecondPart = {
  user: 'naudotoją',
  tool: 'įrankį',
};

export const deleteTitles = {
  user: 'Ištrinti naudotoją',
  tool: 'Ištrinti įrankį',
};

export const roleLabels = {
  [RoleTypes.USER]: 'Naudotojas',
  [RoleTypes.USER_ADMIN]: 'Administratorius',
  [RoleTypes.OWNER]: 'Administratorius',
};

export const FishingEventLabels = {
  [EventTypes.START]: 'Žvejybos pradžia',
  [EventTypes.END]: 'Baigta žvejyba',
  [EventTypes.SKIP]: 'Praleista žvejyba',
  [EventTypes.BUILD_TOOLS]: 'Pastatytas įrankis',
  [EventTypes.REMOVE_TOOLS]: 'Ištrauktas įrankis',
  [EventTypes.WEIGHT_ON_SHORE]: 'Tikslus svoris krante',
  [EventTypes.WEIGHT_ON_BOAT]: 'Patikrintas įrankis',
};
