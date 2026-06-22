export class SettingEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly key: string;
  readonly value: unknown;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    tenantId: string;
    key: string;
    value: unknown;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.key = props.key;
    this.value = props.value;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
