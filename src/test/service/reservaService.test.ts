import { Types } from "mongoose";
import { ReservaService } from "../../main/service/reservaService";
import { ReservaRepository } from "../../main/repository/reservaRepository";
import { MesaService } from "../../main/service/mesaService";

jest.mock("../../main/repository/reservaRepository");
jest.mock("../../main/service/mesaService");

const mockMesaService = new MesaService() as jest.Mocked<MesaService>;
const mockReservaRepository = new ReservaRepository() as jest.Mocked<ReservaRepository>;
const reservaService = new ReservaService();

describe("ReservaService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería guardar una reserva si hay mesas disponibles", async () => {
    const mockReserva = {
      fecha: new Date(),
      turno: "CENA",
      hora: "20:00",
      cantidadPersonas: 4,
    };

    const mockMesas = [new Types.ObjectId()];
    const mockId = new Types.ObjectId();
    const mockHorariosMesasOcupadas = [
      {
        hora: "21:00",
        mesasOcupadasId: [new Types.ObjectId()],
      },
    ];

    // Mock del servicio
    mockMesaService.buscarMesasDisponiblesPorCantPersonasParaReserva.mockResolvedValue(mockMesas);
    mockMesaService.buscarMesasOcupadasPorTurnoYHorarioEnListaReservas.mockReturnValue(mockHorariosMesasOcupadas);
    mockReservaRepository.save.mockResolvedValue({
      _id: mockId,
      ...mockReserva,
      mesa: mockMesas,
      estado: "CONFIRMADA",
    } as any);

    const result = await reservaService.save(mockReserva as any);

    expect(result.id).toEqual(mockId.toString());
  });

  it("debería lanzar un error si no hay mesas disponibles", async () => {
    const mockReserva = {
      fecha: new Date(),
      turno: "CENA",
      hora: "21:00",
      cantidadPersonas: 4,
    };

    // Mock del servicio
    mockMesaService.buscarMesasDisponiblesPorCantPersonasParaReserva.mockResolvedValue([]);
    mockMesaService.buscarMesasOcupadasPorTurnoYHorarioEnListaReservas.mockReturnValue([]);

    await expect(reservaService.save(mockReserva as any)).rejects.toThrow("No hay suficientes mesas disponibles para esta reserva");
  });
});
