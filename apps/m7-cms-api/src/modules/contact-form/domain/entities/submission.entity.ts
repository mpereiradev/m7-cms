export class SubmissionEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly name: string;
  readonly email: string;
  readonly subject: string | null;
  readonly message: string;
  readonly processed: boolean;
  readonly submittedAt: Date;

  constructor(props: {
    id: string;
    tenantId: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    processed: boolean;
    submittedAt: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.name = props.name;
    this.email = props.email;
    this.subject = props.subject;
    this.message = props.message;
    this.processed = props.processed;
    this.submittedAt = props.submittedAt;
  }
}
