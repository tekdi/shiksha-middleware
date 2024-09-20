import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('Cohort')
export class Cohort {
    @PrimaryGeneratedColumn('uuid', { name: 'cohortId' })
    cohortId: string;

    @Column({name: 'attendanceCaptureImage'})
    attendanceCaptureImage: boolean

    @Column({name: 'parentId'})
    parentId: string

    @Column({name: 'name'})
    name: string

    @Column({name: 'type'})
    type: string

    @Column({name: 'image'})
    image: string

    @Column({name: 'referenceId'})
    referenceId: string

    @Column({name: 'metadata'})
    metadata: string

    @Column('uuid', {name: 'tenantId'})
    tenantId: string

    @Column({name: 'programId'})
    programId: string

    @Column({ name: 'status' })
    status: string;

    @Column('uuid', { name: 'createdBy', nullable: true })
    createdBy?: string;

    @Column('uuid', { name: 'updatedBy', nullable: true })
    updatedBy?: string;

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updatedAt' })
    updatedAt: Date;

    constructor(obj: Partial<Cohort>) {
        Object.assign(this, obj);
    }
}
