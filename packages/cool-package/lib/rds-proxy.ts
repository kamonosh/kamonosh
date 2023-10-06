import { Stack } from "aws-cdk-lib"
import { Construct } from "constructs"

import { Peer, Port, SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2"
import { DatabaseInstance, DatabaseProxy, ProxyTarget } from "aws-cdk-lib/aws-rds"

interface RdsProxyProps {
	instance: DatabaseInstance
	vpc: Vpc
}

export class RdsProxy extends Construct {
	proxy: DatabaseProxy
	constructor(scope: Stack, id: string, props: RdsProxyProps) {
		super(scope, id)

		const { instance, vpc } = props
		const { secret } = instance

		const securityGroup = new SecurityGroup(this, 'SecurityGroup', {
			vpc,
		})

		securityGroup.addIngressRule(Peer.anyIpv4(), Port.allTraffic())

		this.proxy = new DatabaseProxy(this, 'Proxy', {
			proxyTarget: ProxyTarget.fromInstance(instance),
			secrets: [
				secret!,
			],
			securityGroups: [
				securityGroup,
			],
			vpc,
		})
	}
}