import React from "react";

import { fetchJson } from "../../api";
import { PersonType } from "../../types";
import Person from "../Person";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";

function People() {
  const [people, setPeople] = React.useState<PersonType[]>([]);
  const [totalPeople, setTotalPeople] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchedName, setSearchedName] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const nextPage = () => {
    //cannot exceed number of pages
    if (currentPage <= totalPeople / 10) {
      setCurrentPage((page) => page + 1);
    }
  };

  const previousPage = () => {
    //cannot decrement beyond 0 (cannot be negative page number)
    if (currentPage >= 1) {
      setCurrentPage((page) => page - 1);
    }
  };

  //initially check how many people exist in the API's Star Wars universe
  React.useEffect(() => {
    fetchJson("people/").then((totalPeopleResponse) => {
      setTotalPeople(totalPeopleResponse.count);
    });
  }, []);

  React.useEffect(() => {
    fetchJson<{ results: PersonType[] }>(`people/?page=${currentPage}`).then(
      (peopleResponse) => {
        setPeople(peopleResponse.results);
      }
    );
  }, [currentPage]);

  return (
    <React.Fragment>
      <div className="people-container">
        <input
          type="text"
          value={searchedName}
          onChange={(text) => setSearchedName(text.target.value)}
        />
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            if (searchedName.trim() !== "") {
              setErrorMessage("");
              fetchJson<{ results: PersonType[] }>(
                `people/?search=${searchedName}`
              ).then((searchResponse) => {
                if (searchResponse.results.length > 0) {
                  setPeople(searchResponse.results);
                  setTotalPeople(searchResponse.results.length);
                  setErrorMessage("");
                } else {
                  setErrorMessage(`No results found for: ${searchedName}`);
                }
              });
            } else {
              setErrorMessage("Name cannot be blank.");
            }
          }}
        >
          Search by Name
        </button>
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            setPeople([]);
            window.location.reload();
          }}
        >
          Reset
        </button>
        {errorMessage && <h4>{errorMessage}</h4>}
        <div className="people-container-content">
          {people.map((person, index) => (
            <Person key={index} person={person} currentPage={currentPage} />
          ))}
        </div>
        <div className="people-container-pagination">
          <div className="people-container-pagination-current-page">
            <p>{`${currentPage} ... ${Math.ceil(totalPeople / 10)}`}</p>
          </div>
          <div className="people-container-pagination-controls">
            <div>
              <FontAwesomeIcon
                icon={faArrowCircleLeft}
                size="2x"
                onClick={previousPage}
              />
            </div>
            <div>
              <FontAwesomeIcon
                icon={faArrowCircleRight}
                size="2x"
                onClick={nextPage}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default People;
