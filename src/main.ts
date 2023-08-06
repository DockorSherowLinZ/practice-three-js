import './style.scss';
import { production } from '@environments';
import { Application } from './app/application';

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}

if (!production) {
  console.warn('Application is running in development mode');
}

async function main() {
  new Application();
}

main().catch(err => console.error(err));
