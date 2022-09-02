# Re-Motion

> Powerful React animation library

This repo is monorepo including package `re-motion`.

### Contribution

First, clone the project into your local machine. Make sure the version you are using matches the following:

- `Node version: v16.16.0`
- `NPM version: 8.19.1`

We are using `lerna` for monorepo package development. If you don't have `lerna`, then install globally using:

```bash
npm install lerna@latest -g
```

Then install the dependencies using the following command:

```bash
npm install
```

This will automatically install all the dependencies for `root`, `packages`, `examples` and symlinks the library.

#### Development

For development start the development server for the package in one terminal.

```bash
npm start
```

and start the development server for example in another terminal.

```bash
npm run start:dev
```

#### Testing

Run the following commands to test the library ( uses `jest` ):

```bash
npm run test
```

#### Publishing

To publish the package:

```bash
lerna publish --no-private
```

Where `--no-private` flag excludes the package with `private: false`.

- And for force publish append `--force-publish`.
- And for tagged release append `--preid <tag_name>`.

## License

MIT
