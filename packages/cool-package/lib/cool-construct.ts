import { App, Stack, StackProps } from 'aws-cdk-lib'

import { InstanceClass, InstanceSize, InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2'
import { DatabaseInstance, DatabaseInstanceEngine, SqlServerEngineVersion } from 'aws-cdk-lib/aws-rds'

import { BackupRestore } from './backup-restore'
import { RdsProxy } from './rds-proxy'

export class CoolConstruct extends Stack {
	constructor(scope: App, id: string, props?: StackProps) {
		super(scope, id, props)

		const vpc = new Vpc(this, 'Vpc')

		const engine = DatabaseInstanceEngine.sqlServerEx({
			version: SqlServerEngineVersion.VER_15_00_4312_2_V1
		})

		const { optionGroup } = new BackupRestore(this, 'BackupRestore', {
			engine,
		})

		const instance = new DatabaseInstance(this, 'DatabaseInstance', {
			engine,
			instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.SMALL),
			optionGroup,
			vpc,
		})

		new RdsProxy(this, 'RDSProxy', {
			instance,
			vpc,
		})
	}
}