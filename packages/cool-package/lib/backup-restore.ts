import { Stack } from "aws-cdk-lib"
import { Construct } from "constructs"

import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { IInstanceEngine, OptionGroup } from "aws-cdk-lib/aws-rds"
import { Bucket } from "aws-cdk-lib/aws-s3"

interface BackupRestoreProps {
	engine: IInstanceEngine
}

export class BackupRestore extends Construct {
	optionGroup: OptionGroup;
	constructor(scope: Stack, id: string, props: BackupRestoreProps) {
		super(scope, id)

		const { engine } = props

		const bucket = new Bucket(this, 'Bucket')

		const role = new Role(this, 'Role', {
			assumedBy: new ServicePrincipal('rds.amazonaws.com')
		})

		bucket.grantReadWrite(role)

		const { roleArn: IAM_ROLE_ARN } = role

		this.optionGroup = new OptionGroup(this, 'OptionGroup', {
			configurations: [
				{
					name: 'SQLSERVER_BACKUP_RESTORE',
					settings: {
						IAM_ROLE_ARN,
					},
				}
			],
			engine,
		})
	}
}