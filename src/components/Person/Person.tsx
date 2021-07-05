import React from "react";
import { PersonType, SpeciesType, FilmType, PlanetType } from "../../types";
import { fetchJson } from "../../api";

interface PersonProps {
  person: PersonType;
  currentPage: number;
}

function Person({ person, currentPage }: PersonProps) {
  const [speciesInfo, setSpeciesInfo] = React.useState<SpeciesType[]>(
    [] as SpeciesType[]
  );
  const [filmInfo, setFilmInfo] = React.useState<FilmType[]>([] as FilmType[]);
  const [planetInfo, setPlanetInfo] = React.useState<PlanetType[]>(
    [] as PlanetType[]
  );

  const capitalizeString = (str: string) => {
    if (str === "n/a") {
      return str.toUpperCase();
    } else {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  React.useEffect(() => {
    //get name of species
    if (person.species.length > 0) {
      fetchJson(
        `${person.species[0].substring(
          person.species[0].indexOf("/species/") + 1
        )}`
      ).then((speciesResponse) => setSpeciesInfo(speciesResponse.name));
    }

    //get names of the planets from which characters originate
    fetchJson(
      `${person.homeworld.substring(person.homeworld.indexOf("/planets/") + 1)}`
    ).then((planetResponse) => setPlanetInfo(planetResponse.name));

    //get films in which character is present
    let films: FilmType[] = [];
    person.films.forEach((film) => {
      fetchJson(
        `${film.substring(film.indexOf("/films/") + 1)}`
      ).then((filmResponse) => films.push(filmResponse.title));
    });

    setFilmInfo(films);
  }, [person]);

  const parseObject = (obj: any) => {
    return obj.toString();
  };

  return (
    <div className="person-container">
      <ul>
        <li>
          <span className="person-label">Name</span>: {person.name}
        </li>
        <li>
          <span className="person-label">Gender</span>:{" "}
          {capitalizeString(person.gender)}
        </li>
        <li>
          <span className="person-label">Homeworld</span>:{" "}
          {parseObject(planetInfo)}
        </li>
        <li>
          <span className="person-label">Species</span>:{" "}
          {typeof speciesInfo === "object" ? "Human" : parseObject(speciesInfo)}
        </li>
        <span className="person-label">Films</span>:
        <ul>
          {filmInfo.map((film, idx) => (
            <li key={idx}>{film}</li>
          ))}
        </ul>
      </ul>
    </div>
  );
}

export default Person;
