# Utils

The module exposes several internal server utilities that are accessible through the `#auth_utils` module:

- **`sendEmail`** - Enables the sending of email messages.
- **`handleError`** - Facilitates the creation and throwing of `h3` errors, or redirects with the `error` parameter passed as a query.
- **`hashSync, compareSync`** - Provides functions for hashing and verifying strings using the [`bcrypt-edge`](https://github.com/bruceharrison1984/bcrypt-edge) package.
- **`encode, decode`** - Offers functionality for signing and verifying JSON Web Tokens (JWT) using the [`jose`](https://github.com/panva/jose) package.
