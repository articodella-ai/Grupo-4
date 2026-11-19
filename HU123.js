// Esperamos a que el DOM se cargue completamente
document.addEventListener('DOMContentLoaded', () => {

    // ========================================================
    // SECCIÓN 1: HU002 - ESTIMACIÓN DE IMPACTO ENERGÉTICO
    // ========================================================
    
    // 1. Selección de elementos del DOM
    const formEstimacion = document.getElementById('form-estimacion');
    const selectEnergia = document.getElementById('tipo-energia');
    const selectConsumo = document.getElementById('nivel-consumo');
    const contenedorResultadoImpacto = document.getElementById('resultado-impacto');
    const txtKwh = document.getElementById('valor-kwh');
    const txtCo2 = document.getElementById('valor-co2');
    const barraProgreso = document.getElementById('barra-progreso');
    const textoEficiencia = document.getElementById('texto-eficiencia');

    // Tablas de cálculo según nivel de consumo ($kWh$ estimado mensual)
    const datosConsumo = {
        bajo: { kwh: 120, co2Factor: 0.23 },
        medio: { kwh: 250, co2Factor: 0.23 },
        alto: { kwh: 450, co2Factor: 0.23 }
    };

    // Escuchador de evento submit para HU002
    formEstimacion.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Previene recarga de página

        const tipoEnergia = selectEnergia.value;
        const nivelConsumo = selectConsumo.value;

        if (!datosConsumo[nivelConsumo]) return;

        // Cálculo de consumo e impacto
        let kwhMensual = datosConsumo[nivelConsumo].kwh;
        
        // Ajuste según tipo de energía (Paneles solares reducen impacto de red)
        if (tipoEnergia === 'mixto') {
            kwhMensual = Math.round(kwhMensual * 0.6); // 40% ahorro por solar
        }

        // Cálculo aproximado de emisiones de CO2 (factor prom. 0.23 kg CO2/kWh)
        const kgCo2 = (kwhMensual * datosConsumo[nivelConsumo].co2Factor).toFixed(1);

        // Actualización de valores en la pantalla (DOM)
        txtKwh.textContent = `${kwhMensual} kWh/mes`;
        txtCo2.textContent = `${kgCo2} kg CO₂`;

        // Lógica para actualizar la barra de eficiencia energética
        let porcentajeEficiencia = 50;
        let colorBarra = '#f39c12'; // Amarillo por defecto
        let etiqueta = 'Eficiencia Promedio';

        if (nivelConsumo === 'bajo' || tipoEnergia === 'mixto') {
            porcentajeEficiencia = 85;
            colorBarra = '#2ecc71'; // Verde
            etiqueta = '¡Alta Eficiencia Energética!';
        } else if (nivelConsumo === 'alto') {
            porcentajeEficiencia = 30;
            colorBarra = '#e74c3c'; // Rojo
            etiqueta = 'Elevado consumo. Requiere atención.';
        }

        barraProgreso.style.width = `${porcentajeEficiencia}%`;
        barraProgreso.style.backgroundColor = colorBarra;
        textoEficiencia.textContent = etiqueta;

        // Mostrar tarjeta de resultados
        contenedorResultadoImpacto.classList.remove('resultado-oculto');
    });


    // ========================================================
    // SECCIÓN 2: HU001 - RECOMENDACIONES PERSONALIZADAS
    // ========================================================

    // 1. Selección de elementos del DOM
    const formHabitos = document.getElementById('form-habitos');
    const checksHabitos = document.querySelectorAll('.habito-check');
    const contenedorConsejos = document.getElementById('contenedor-consejos');
    const listaConsejos = document.getElementById('lista-consejos');

    // Diccionario de consejos automáticos vinculados al hábito
    const baseConsejos = {
        luces: 'Luces encendidas: Reemplaza focos por tecnología LED de alto rendimiento y aprovecha la luz natural durante el día.',
        vampiro: 'Consumo Vampiro:Utiliza multicontactos con interruptor para apagar completamente televisores y cargadores al terminar de usarlos.',
        terma: 'Calentador/Terma:Instala un temporizador (timer) digital para encender la terma solo 1 o 2 horas antes de usarla.',
        refrigerador: 'Refrigerador: Mantén el empaque de la puerta limpio y ajustado, y evita introducir alimentos calientes.'
    };

    // Escuchador de evento submit para HU001
    formHabitos.addEventListener('submit', (evento) => {
        evento.preventDefault();

        // Limpiar recomendaciones anteriores
        listaConsejos.innerHTML = '';

        let habitosSeleccionados = 0;

        // Recorremos los checkboxes seleccionados por el usuario
        checksHabitos.forEach((check) => {
            if (check.checked) {
                habitosSeleccionados++;
                const itemLi = document.createElement('li');
                itemLi.innerHTML = baseConsejos[check.value];
                listaConsejos.appendChild(itemLi);
            }
        });

        // Si no seleccionó ninguno, se le entrega un consejo general por defecto
        if (habitosSeleccionados === 0) {
            const itemLi = document.createElement('li');
            itemLi.innerHTML = 'Buen trabajo: Continúa manteniendo tus buenos hábitos diarios de consumo consciente en el hogar.';
            listaConsejos.appendChild(itemLi);
        }

        // Mostrar contenedor de consejos en pantalla
        contenedorConsejos.classList.remove('resultado-oculto');
    });

    // Esperar a que el DOM esté completamente cargado (garantizado también por el uso de 'defer')
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SELECCIÓN DE ELEMENTOS DEL DOM
    const formChecklist = document.getElementById('form-checklist');
    const inputHora = document.getElementById('hora-alerta');
    const checkActivar = document.getElementById('activar-checklist');
    const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');
    const panelTareas = document.getElementById('panel-tareas');

    // Variable para almacenar el temporizador activo
    let temporizadorAlerta = null;

    // 2. ESCUCHA DE EVENTOS
    // Escuchamos el evento 'submit' del formulario al guardar la configuración
    formChecklist.addEventListener('submit', (evento) => {
        // Prevenir la recarga de la página por defecto al enviar el formulario
        evento.preventDefault();

        // Obtener los valores ingresados por el usuario
        const horaSeleccionada = inputHora.value;
        const estaActivado = checkActivar.checked;

        if (!estaActivado) {
            // Si el usuario desmarca la opción, limpiamos alertas existentes
            if (temporizadorAlerta) clearTimeout(temporizadorAlerta);
            
            // Mostrar mensaje informando la desactivación
            mostrarMensaje('El checklist de descanso ha sido desactivado.', 'info');
            panelTareas.classList.remove('panel-tareas-visible');
            panelTareas.classList.add('panel-tareas-oculto');
            return;
        }

        // 3. REGISTRO Y CONFIGURACIÓN DEL SISTEMA
        // Guardar la configuración en localStorage para persistencia básica
        const configuracion = {
            hora: horaSeleccionada,
            activado: estaActivado
        };
        localStorage.setItem('configuracionChecklist', JSON.stringify(configuracion));

        // Programar la alerta diaria según la hora seleccionada
        programarAlertaDiaria(horaSeleccionada);

        // 4. CAMBIOS EN LA PÁGINA (MENSAJE DE CONFIRMACIÓN Y VISUALIZACIÓN)
        mostrarMensaje(`Configuración guardada correctamente. Alerta programada diariamente a las ${horaSeleccionada} hs.`, 'exito');
        
        // Mostrar el panel interactivo de tareas
        panelTareas.classList.remove('panel-tareas-oculto');
        panelTareas.classList.add('panel-tareas-visible');
    });

    // Función para mostrar mensajes de confirmación dinámicos
    function mostrarMensaje(texto, tipo) {
        mensajeConfirmacion.textContent = texto;
        mensajeConfirmacion.className = 'mensaje-exito'; // Aplica la clase visible en CSS
    }

    // Función para calcular y programar el aviso o recordatorio a la hora establecida
    function programarAlertaDiaria(horaString) {
        if (temporizadorAlerta) clearTimeout(temporizadorAlerta);

        const ahora = new Date();
        const [horas, minutos] = horaString.split(':');
        const horaAlerta = new Date();

        horaAlerta.setHours(parseInt(horas, 10));
        horaAlerta.setMinutes(parseInt(minutos, 10));
        horaAlerta.setSeconds(0);

        // Si la hora definida ya pasó hoy, se programa para el día siguiente
        if (horaAlerta <= ahora) {
            horaAlerta.setDate(horaAlerta.getDate() + 1);
        }

        const tiempoRestanteMs = horaAlerta - ahora;

        // Establecer el temporizador
        temporizadorAlerta = setTimeout(() => {
            alert('¡Es hora del Checklist de Descanso! Por favor verifica el apagado de luces y dispositivos.');
            // Re-programar para el siguiente día (ciclo diario de 24 horas)
            programarAlertaDiaria(horaString);
        }, tiempoRestanteMs);
    }
    });
});
