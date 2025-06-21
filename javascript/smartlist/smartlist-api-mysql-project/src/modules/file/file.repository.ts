import { EntityRepository, Repository } from 'typeorm';
import { AssetFile } from '../../entities/asset-file.entity';

@EntityRepository(AssetFile)
export class FileRepository extends Repository<AssetFile> {}
