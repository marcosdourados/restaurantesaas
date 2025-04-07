// Arquivo de seed para popular o banco de dados com dados iniciais para desenvolvimento
// Este arquivo será executado após as migrações para criar dados de teste

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar restaurante de exemplo
  const restaurant = await prisma.restaurant.create({
    data: {
      id: 'rst_' + uuidv4().substring(0, 8),
      name: 'Restaurante Exemplo',
      logoUrl: 'https://via.placeholder.com/150',
      address: JSON.stringify({
        street: 'Av. Paulista, 1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      }),
      phone: '11999998888',
      email: 'contato@restauranteexemplo.com.br',
      taxId: '12.345.678/0001-90',
      settings: JSON.stringify({
        themeColor: '#FF5722',
        currency: 'BRL',
        timezone: 'America/Sao_Paulo'
      })
    }
  });

  console.log(`Restaurante criado: ${restaurant.name} (${restaurant.id})`);

  // Criar usuário administrador
  const hashedPassword = await bcrypt.hash('senha123', 10);
  const admin = await prisma.user.create({
    data: {
      id: 'usr_' + uuidv4().substring(0, 8),
      restaurantId: restaurant.id,
      roleId: 'role_admin',
      name: 'Administrador',
      email: 'admin@restauranteexemplo.com.br',
      password: hashedPassword,
      active: true
    }
  });

  console.log(`Usuário administrador criado: ${admin.email} (${admin.id})`);

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: 'cat_' + uuidv4().substring(0, 8),
        restaurantId: restaurant.id,
        name: 'Entradas',
        description: 'Pratos para começar sua refeição',
        imageUrl: 'https://via.placeholder.com/150',
        order: 1
      }
    }),
    prisma.category.create({
      data: {
        id: 'cat_' + uuidv4().substring(0, 8),
        restaurantId: restaurant.id,
        name: 'Pratos Principais',
        description: 'Nossos principais pratos',
        imageUrl: 'https://via.placeholder.com/150',
        order: 2
      }
    }),
    prisma.category.create({
      data: {
        id: 'cat_' + uuidv4().substring(0, 8),
        restaurantId: restaurant.id,
        name: 'Sobremesas',
        description: 'Opções para finalizar sua refeição',
        imageUrl: 'https://via.placeholder.com/150',
        order: 3
      }
    }),
    prisma.category.create({
      data: {
        id: 'cat_' + uuidv4().substring(0, 8),
        restaurantId: restaurant.id,
        name: 'Bebidas',
        description: 'Bebidas para acompanhar sua refeição',
        imageUrl: 'https://via.placeholder.com/150',
        order: 4
      }
    })
  ]);

  console.log(`${categories.length} categorias criadas`);

  // Criar produtos
  const products = [];
  
  // Entradas
  products.push(await prisma.product.create({
    data: {
      id: 'prd_' + uuidv4().substring(0, 8),
      restaurantId: restaurant.id,
      categoryId: categories[0].id,
      name: 'Bruschetta',
      description: 'Fatias de pão italiano com tomate, alho e manjericão',
      price: 25.90,
      cost: 10.50,
      imageUrl: 'https://via.placeholder.com/150',
      available: true
    }
  }));
  
  products.push(await prisma.product.create({
    data: {
      id: 'prd_' + uuidv4().substring(0, 8),
      restaurantId: restaurant.id,
      categoryId: categories[0].id,
      name: 'Carpaccio',
      description: 'Finas fatias de carne crua com molho especial',
      price: 35.90,
      cost: 18.00,
      imageUrl: 'https://via.placeholder.com/150',
      available: true
    }
  }));
  
  // Pratos Principais
  products.push(await prisma.product.create({
    data: {
      id: 'prd_' + uuidv4().substring(0, 8),
      restaurantId: restaurant.id,
      categoryId: categories[1].id,
      name: 'Risoto de Funghi',
      description: 'Risoto cremoso com mix de cogumelos',
      price: 45.90,
      cost: 22.00,
      imageUrl: 'https://via.placeholder.com/150',
      available: true
    }
  }));
  
  products.push(await prisma.product.create({
    data: {
      id: 'prd_' + uuidv4().substring(0, 8),
      restaurantId: restaurant.id,
      categoryId: categories[1].id,
      name: 'Filé ao Molho Madeira',
      description: 'Filé mignon grelhado com molho madeira e batatas',
      price: 59.90,
      cost: 30.00,
      imageUrl: 'https://via.placeholder.com/150',
      available: true
    }
  }));
  
  // Sobremesas
  products.push(await prisma.product.create({
    data: {
      id: 'prd_' + uuidv4().substring(0, 8),
      restaurantId: restaurant.id,
      categoryId: categories[2].id,
      name: 'Pudim de Leite',
      description: 'Pudim tradicional com calda de caramelo',
      price: 15.90,
      cost: 5.00,
      imageUrl: 'https://via.placeholder.com/150',
      available: true
    }
  }));
  
  // Bebidas
  products.push(await prisma.product.create({
    data: {
      id: 'prd_' + uuidv4().substring(0, 8),
      restaurantId: restaurant.id,
      categoryId: categories[3].id,
      name: 'Água Mineral',
      description: 'Garrafa 500ml',
      price: 5.90,
      cost: 1.50,
      imageUrl: 'https://via.placeholder.com/150',
      available: true
    }
  }));
  
  products.push(await prisma.product.create({
    data: {
      id: 'prd_' + uuidv4().substring(0, 8),
      restaurantId: restaurant.id,
      categoryId: categories[3].id,
      name: 'Refrigerante',
      description: 'Lata 350ml',
      price: 6.90,
      cost: 2.00,
      imageUrl: 'https://via.placeholder.com/150',
      available: true
    }
  }));

  console.log(`${products.length} produtos criados`);

  // Criar áreas
  const areas = await Promise.all([
    prisma.area.create({
      data: {
        id: 'are_' + uuidv4().substring(0, 8),
        restaurantId: restaurant.id,
        name: 'Salão Principal',
        description: 'Área interna climatizada'
      }
    }),
    prisma.area.create({
      data: {
        id: 'are_' + uuidv4().substring(0, 8),
        restaurantId: restaurant.id,
        name: 'Varanda',
        description: 'Área externa coberta'
      }
    })
  ]);

  console.log(`${areas.length} áreas criadas`);

  // Criar mesas
  const tables = [];
  
  // Mesas do Salão Principal
  for (let i = 1; i <= 10; i++) {
    tables.push(await prisma.table.create({
      data: {
        id: 'tbl_' + uuidv4().substring(0, 8),
        restaurantId: restaurant.id,
        areaId: areas[0].id,
        number: i.toString().padStart(2, '0'),
        seats: i % 2 === 0 ? 4 : 2,
        status: 'available',
        qrCodeUrl: `https://via.placeholder.com/150?text=Mesa${i}`
      }
    }));
  }
  
  // Mesas da Varanda
  for (let i = 1; i <= 5; i++) {
    tables.push(await prisma.table.create({
      data: {
        id: 'tbl_' + uuidv4().substring(0, 8),
        restaurantId: restaurant.id,
        areaId: areas[1].id,
        number: (i + 10).toString().padStart(2, '0'),
        seats: 6,
        status: 'available',
        qrCodeUrl: `https://via.placeholder.com/150?text=Mesa${i+10}`
      }
    }));
  }

  console.log(`${tables.length} mesas criadas`);

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
