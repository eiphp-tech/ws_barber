import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...\n");

  // ========================================
  // LIMPAR DADOS EXISTENTES
  // ========================================

  console.log("🗑️  Limpando dados existentes...");

  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.barberSchedule.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Dados limpos\n");

  // ========================================
  // HASH DE SENHA PADRÃO
  // ========================================

  const passwordHash = await bcrypt.hash("123456", 10);
  console.log("🔐 Hash de senha gerado\n");

  // ========================================
  // CRIAR BARBEIROS (Controle total 360°)
  // ========================================

  console.log("💈 Criando barbeiros...");

  const barber1 = await prisma.user.create({
    data: {
      name: "Jhonathan Pereira",
      email: "jhonathan@wsbarber.com",
      password: passwordHash,
      phone: "(11) 98765-4323",
      role: Role.BARBEIRO,
      avatar: "https://i.pravatar.cc/150?img=33",
    },
  });
  console.log("   ✅ Barbeiro: Jhonathan Pereira");

  const barber2 = await prisma.user.create({
    data: {
      name: "Marcos Silver",
      email: "marcos@wsbarber.com",
      password: passwordHash,
      phone: "(11) 98765-4324",
      role: Role.BARBEIRO,
      avatar: "https://i.pravatar.cc/150?img=68",
    },
  });
  console.log("   ✅ Barbeiro: Marcos Silver\n");

  // ========================================
  // CRIAR CLIENTES
  // ========================================

  console.log("👤 Criando clientes...");

  const client1 = await prisma.user.create({
    data: {
      name: "Pedro Gonçalves",
      email: "pedro@email.com",
      password: passwordHash,
      phone: "(11) 98765-4325",
      role: Role.CLIENTE,
      avatar: "https://i.pravatar.cc/150?img=15",
    },
  });
  console.log("   ✅ Cliente: Pedro Gonçalves");

  const client2 = await prisma.user.create({
    data: {
      name: "Miguel Oliveira",
      email: "miguel@email.com",
      password: passwordHash,
      phone: "(11) 98765-4326",
      role: Role.CLIENTE,
      avatar: "https://i.pravatar.cc/150?img=25",
    },
  });
  console.log("   ✅ Cliente: Miguel Oliveira");

  const client3 = await prisma.user.create({
    data: {
      name: "Lucas Santos",
      email: "lucas@email.com",
      password: passwordHash,
      phone: "(11) 98765-4327",
      role: Role.CLIENTE,
      avatar: "https://i.pravatar.cc/150?img=30",
    },
  });
  console.log("   ✅ Cliente: Lucas Santos\n");

  // ========================================
  // CRIAR SERVIÇOS
  // ========================================

  console.log("✂️  Criando serviços...");

  const serviceCorte = await prisma.service.create({
    data: {
      name: "Corte de Cabelo",
      description: "Estilo personalizado com as últimas tendências.",
      price: 50.0,
      duration: 45,
      imageUrl:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
      active: true,
    },
  });
  console.log("   ✅ Corte de Cabelo - R$ 50,00 (45min)");

  const serviceBarba = await prisma.service.create({
    data: {
      name: "Barba",
      description: "Modelagem completa para destacar sua masculinidade.",
      price: 45.0,
      duration: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400",
      active: true,
    },
  });
  console.log("   ✅ Barba - R$ 45,00 (30min)");

  const servicePezinho = await prisma.service.create({
    data: {
      name: "Pézinho",
      description: "Acabamento perfeito para um visual renovado.",
      price: 20.0,
      duration: 15,
      imageUrl:
        "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400",
      active: true,
    },
  });
  console.log("   ✅ Pézinho - R$ 20,00 (15min)");

  const serviceSobrancelha = await prisma.service.create({
    data: {
      name: "Sobrancelha",
      description: "Expressão acentuada com modelagem precisa.",
      price: 25.0,
      duration: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400",
      active: true,
    },
  });
  console.log("   ✅ Sobrancelha - R$ 25,00 (20min)");

  const serviceMassagem = await prisma.service.create({
    data: {
      name: "Massagem",
      description: "Relaxe e renove com nossos tratamentos revitalizantes.",
      price: 35.0,
      duration: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
      active: true,
    },
  });
  console.log("   ✅ Massagem - R$ 35,00 (20min)");

  const serviceHidratacao = await prisma.service.create({
    data: {
      name: "Hidratação",
      description: "Fios hidratados, macios e brilhantes.",
      price: 30.0,
      duration: 25,
      imageUrl:
        "https://images.unsplash.com/photo-1562004760-acb5514c9dc3?w=400",
      active: true,
    },
  });
  console.log("   ✅ Hidratação - R$ 30,00 (25min)\n");

  // ========================================
  // CRIAR HORÁRIOS DOS BARBEIROS
  // ========================================

  console.log("📅 Criando horários dos barbeiros...");

  await prisma.barberSchedule.create({
    data: {
      barberId: barber1.id,
      mondayStart: "09:00",
      mondayEnd: "18:00",
      tuesdayStart: "09:00",
      tuesdayEnd: "18:00",
      wednesdayStart: "09:00",
      wednesdayEnd: "18:00",
      thursdayStart: "09:00",
      thursdayEnd: "18:00",
      fridayStart: "09:00",
      fridayEnd: "18:00",
      saturdayStart: "09:00",
      saturdayEnd: "14:00",
    },
  });
  console.log("   ✅ Jhonathan: Seg-Sex 09:00-18:00, Sáb 09:00-14:00");

  await prisma.barberSchedule.create({
    data: {
      barberId: barber2.id,
      tuesdayStart: "10:00",
      tuesdayEnd: "19:00",
      wednesdayStart: "10:00",
      wednesdayEnd: "19:00",
      thursdayStart: "10:00",
      thursdayEnd: "19:00",
      fridayStart: "10:00",
      fridayEnd: "19:00",
      saturdayStart: "10:00",
      saturdayEnd: "16:00",
      sundayStart: "10:00",
      sundayEnd: "14:00",
    },
  });
  console.log(
    "   ✅ Marcos: Ter-Sex 10:00-19:00, Sáb 10:00-16:00, Dom 10:00-14:00\n"
  );

  // ========================================
  // RESUMO FINAL
  // ========================================

  const totalUsers = await prisma.user.count();
  const totalBarbers = await prisma.user.count({
    where: { role: Role.BARBEIRO },
  });
  const totalClients = await prisma.user.count({
    where: { role: Role.CLIENTE },
  });
  const totalServices = await prisma.service.count();
  const totalSchedules = await prisma.barberSchedule.count();

  console.log("🎉 Seed concluído com sucesso!\n");
  console.log("📊 Dados criados:");
  console.log(
    `   - ${totalUsers} usuários (${totalBarbers} barbeiros + ${totalClients} clientes)`
  );
  console.log(`   - ${totalServices} serviços`);
  console.log(`   - ${totalSchedules} horários de barbeiros\n`);

  console.log("🔑 Credenciais para teste:");
  console.log("   💈 BARBEIRO:");
  console.log("      📧 Email: jhonathan@wsbarber.com");
  console.log("      🔒 Senha: 123456");
  console.log("");
  console.log("   👤 CLIENTE:");
  console.log("      📧 Email: pedro@email.com");
  console.log("      🔒 Senha: 123456\n");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
