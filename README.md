# Biuro turystyczne - Aplikacja Webowa na bazie Angular 17, wraz z Backend -em zbudowanym w Firebase.

### Autor:
- [Dominik Breksa](https://github.com/ForNeus57)

## Opis:

Jest to Angularowa aplikacja webowa, która pozwala na przeglądanie ofert biura turystycznego, dodawanie ich do koszyka, a także składanie zamówień. Aplikacja posiada również panel administracyjny, który pozwala na zarządzanie ofertami, zamówieniami oraz użytkownikami.

Urzytkownicy mogą przeglądać oferty, dodawać je do koszyka, a także składać zamówienia.

Schemat bazy danych znajduje się w pliku `studia-biuro-turystyczne-default-rtdb-export.json`.

Reguły dostępu do bazy danych znajdują się w pliku `rules.json`.

## Funkcjonalności:

* Autentyfikacja użytkowników (Logowanie, rejestracja)
* Przeglądanie ofert (filtracja, paginacja i zmiana waluty)
* Dodawanie ofert do koszyka
* Składanie zamówień
* Panel administracyjny - łącznie z banowaniem użytkowników przez konto administratora. Zmiana roli użytkownika.
* Dodawanie, usuwanie ofert wycieczek.
* Wykorzystanie routingu w celu nawigacji między komponentami.
* Historia zamówień danego użytkownika, wraz z alertami o zbliżających się wycieczkach.

## Technologie:

- Angular 17
- Firebase (Realtime Database, Authentication)
- Bootstrap, MaterialUI
- HTML
- CSS
- TypeScript
- Express.js
