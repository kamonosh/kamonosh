import { App } from 'aws-cdk-lib'

import { CoolConstruct } from '../lib'

const app = new App()

new CoolConstruct(app, 'CoolConstruct')