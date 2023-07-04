import { Column, Entity } from 'typeorm';
import BaseEntity from '@modules/database/entities/base.entity';

@Entity('serializer')
export default class SerializerEntity extends BaseEntity {
  @Column()
  public action: string;

  @Column('text', { array: true })
  public fields: string[];

  constructor(props: Partial<SerializerEntity>) {
    super();
    Object.assign(this, props);
  }
}
