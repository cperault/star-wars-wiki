export interface PersonType {
  name: string;
  gender: string;
  homeworld: string;
  species: string;
  films: Array<string>;
}

export interface SpeciesType {
  name: string;
  classification: string;
  designation: string;
  average_lifespan: string;
  language: string;
}

export interface FilmType {
  title: string;
}

export interface PlanetType {
  name: string;
  population: string;
}
