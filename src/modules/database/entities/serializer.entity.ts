import { Column, Entity } from 'typeorm';
import BaseEntity from '@modules/database/entities/base.entity';

@Entity('serializer')
export default class SerializerEntity extends BaseEntity {
  @Column()
  public method: string;

  @Column('json')
  public objectField: string;

  constructor(props: Partial<SerializerEntity>) {
    super();
    Object.assign(this, props);
  }
}
