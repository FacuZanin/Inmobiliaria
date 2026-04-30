// backend\src\database\seeds\admin.seed.ts
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../../modules/user/domain/entities/user.entity';
import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserType } from '@shared/contracts/enums/user-type.enum';

export const seedAdmin = async (dataSource: DataSource): Promise<void> => {
  const userRepo = dataSource.getRepository(User);

  const exists = await userRepo.findOne({
    where: { email: 'admin@admin.com' },
  });

  if (exists) {
    console.log('✔ Admin ya existe');
    return;
  }

  const password = await bcrypt.hash('admin123', 10);

  const admin = userRepo.create({
    email: 'admin@admin.com',
    password,
    role: UserRole.SUPERADMIN,
    tipo: UserType.AGENCIA,
    nombre: 'Admin',
    apellido: 'Sistema',
  });

  await userRepo.save(admin);

  console.log('✅ Admin creado correctamente');
};
