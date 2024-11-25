import { CalendarioService } from "../calendarioService";
import { startOfDay, endOfDay } from "../../util/dateUtil";
import { TipoDisponibilidad } from "../../enum/tipoDisponibilidadEnum";
import { DiaSemana } from "../../enum/diaSemanaEnum";
import { MesaService } from "../mesaService";
import { ReservaService } from "../reservaService";

jest.mock("../src/service/reservaService", () => {
  return {
    ReservaService: jest.fn().mockImplementation(() => {
      return {
        getReservasByPeriodoAndTurno: jest.fn().mockResolvedValue([]),
      };
    }),
  };
});

jest.mock("../src/service/mesaService", () => {
  return {
    MesaService: jest.fn().mockImplementation(() => {
      return {
        isAlgunaMesaDisponibleParaCualquierHorarioReserva: jest.fn().mockResolvedValue(true),
      };
    }),
  };
});

describe("CalendarioService - getDisponibilidadDias", () => {
  let calendarioService: CalendarioService;
  let reservaServiceMock: jest.Mocked<ReservaService>;
  let mesaServiceMock: jest.Mocked<MesaService>;

  beforeEach(() => {
    reservaServiceMock = new ReservaService() as jest.Mocked<ReservaService>;
    mesaServiceMock = new MesaService() as jest.Mocked<MesaService>;
    calendarioService = new CalendarioService();
  });

  it("Debería marcar los Domingos como no disponibles", async () => {
    const turno = "almuerzo";
    const personas = 4;

    reservaServiceMock.getReservasByPeriodoAndTurno.mockResolvedValue([]);

    const resultado = await calendarioService.getDisponibilidadDias(turno, personas);

    const diasDomingo = resultado.filter(
      (dia) => startOfDay(dia.fecha).getDay() === DiaSemana.DOMINGO
    );

    diasDomingo.forEach((dia) => {
      expect(dia.disponible).toBe(false);
      expect(dia.tipo).toBe(TipoDisponibilidad.NO_DISPONIBLE_CERRADO);
    });
  });

  it("Debería marcar días sin reservas como disponibles", async () => {
    const turno = "almuerzo";
    const personas = 4;

    reservaServiceMock.getReservasByPeriodoAndTurno.mockResolvedValue([]);
    mesaServiceMock.isAlgunaMesaDisponibleParaCualquierHorarioReserva.mockResolvedValue(true);

    const resultado = await calendarioService.getDisponibilidadDias(turno, personas);

    resultado.forEach((dia) => {
      expect(dia.disponible).toBe(true);
      expect(dia.tipo).toBe(TipoDisponibilidad.DISPONIBLE);
    });
  });

  it("Debería marcar días con reservas y sin mesas disponibles como no disponibles", async () => {
    const turno = "almuerzo";
    const personas = 4;

    const mockReservas = [
      { fecha: new Date(), mesa: "Mesa1" }, // Agrega los atributos necesarios
    ];

    reservaServiceMock.getReservasByPeriodoAndTurno.mockResolvedValue(mockReservas as any);
    mesaServiceMock.isAlgunaMesaDisponibleParaCualquierHorarioReserva.mockResolvedValue(false);

    const resultado = await calendarioService.getDisponibilidadDias(turno, personas);

    resultado.forEach((dia) => {
      expect(dia.disponible).toBe(false);
      expect(dia.tipo).toBe(TipoDisponibilidad.NO_DISPONIBLE);
    });
  });

  it("Debería respetar el período de 60 días", async () => {
    const turno = "almuerzo";
    const personas = 4;

    reservaServiceMock.getReservasByPeriodoAndTurno.mockResolvedValue([]);
    const resultado = await calendarioService.getDisponibilidadDias(turno, personas);

    const fechaInicio = startOfDay(new Date());
    const fechaFin = endOfDay(new Date());
    fechaFin.setDate(fechaFin.getDate() + 60);

    expect(resultado.length).toBe(60);
    resultado.forEach((dia) => {
      expect(dia.fecha >= fechaInicio).toBe(true);
      expect(dia.fecha <= fechaFin).toBe(true);
    });
  });
});


