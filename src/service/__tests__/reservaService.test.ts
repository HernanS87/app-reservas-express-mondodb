import { ReservaService } from "../reservaService";
import { ReservaRepository } from "../../repository/reservaRepository";
import { MesaService } from "../mesaService";
import { Reserva } from "../../model/entity/reserva";

import { Types } from "mongoose";

// Mock de dependencias
jest.mock("../../../repository/reservaRepository");
jest.mock("../../../service/mesaService");

describe("ReservaService", () => {
  let reservaService: ReservaService;
  let mockReservaRepository: jest.Mocked<ReservaRepository>;
  let mockMesaService: jest.Mocked<MesaService>;

  beforeEach(() => {
    mockReservaRepository = new ReservaRepository() as jest.Mocked<ReservaRepository>;
    mockMesaService = new MesaService() as jest.Mocked<MesaService>;
    reservaService = new ReservaService();

    // Inyectar mocks
    (reservaService as any).reservaRepository = mockReservaRepository;
    (reservaService as any).mesaService = mockMesaService;
  });

  it("debería guardar una reserva si hay mesas disponibles", async () => {
    // Datos de prueba
    const mockReserva = {
      fecha: new Date(),
      turno: "CENA",
      hora: "20:00",
      cantidadPersonas: 4,
    };
    const mockMesas = [new Types.ObjectId()];

    // Configuración de mocks
    mockMesaService.buscarMesasDisponiblesPorCantPersonasParaReserva.mockResolvedValue(mockMesas);
    mockReservaRepository.save.mockResolvedValue(new Reserva({ ...mockReserva, mesa: mockMesas }));

    // Llamar al método y verificar resultado
    const result = await reservaService.save(mockReserva as any);
    expect(result.mesa).toEqual(mockMesas);
    expect(result.estado).toBe("CONFIRMADA");
    expect(mockReservaRepository.save).toHaveBeenCalled();
  });

  it("debería lanzar un error si no hay mesas disponibles", async () => {
    const mockReserva = {
      fecha: new Date(),
      turno: "CENA",
      hora: "20:00",
      cantidadPersonas: 4,
    };

    mockMesaService.buscarMesasDisponiblesPorCantPersonasParaReserva.mockResolvedValue([]);

    await expect(reservaService.save(mockReserva as any)).rejects.toThrow(
      "No hay suficientes mesas disponibles para esta reserva"
    );
  });
});
