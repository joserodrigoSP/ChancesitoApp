/* =========================================================
   CV PRO - SISTEMA PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const state = { 
        design: "modern", 
        education: [], 
        experience: [], 
        skills: [], 
        languages: [], 
        hobbies: [], 
        others: [],
        refPersonal: [],
        refLaboral: []
    };

    const $ = id => document.getElementById(id);

    // DATOS PERSONALES
    const personalInputs = ["in-name", "in-lastname", "in-title", "in-email", "in-tele", "in-dire", "profile-description"];
    personalInputs.forEach(id => {
        const element = $(id);
        if (element) element.addEventListener("input", actualizarCV);
    });

    // FOTO DE PERFIL
    $("in-avatar").addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (event) {
            const image = $("out-avatar");
            const placeholder = $("avatar-placeholder");
            image.src = event.target.result;
            image.style.display = "block";
            placeholder.style.display = "none";
        };
        reader.readAsDataURL(file);
    });

    // PERSONALIZAR COLORES
    $("in-color-accent").addEventListener("input", e => $("cv-document").style.setProperty("--accent", e.target.value));
    $("in-color-dark").addEventListener("input", e => $("cv-document").style.setProperty("--cv-dark", e.target.value));
    $("in-color-text").addEventListener("input", e => $("cv-document").style.setProperty("--cv-text", e.target.value));

    // ACTUALIZAR CV
    function actualizarCV() {
        const val = id => $(id).value.trim();$("out-fullname").textContent = `${val("in-name")} ${val("in-lastname")}`.trim() || "Tu Nombre";
        $("out-title").textContent = val("in-title") || "Tu profesión";
        $("out-email").textContent = val("in-email");
        $("out-tele").textContent = val("in-tele");
        $("out-dire").textContent = val("in-dire");
        $("out-profile-description").textContent = val("profile-description");

        renderEducation();
        renderExperience();
        renderSkills();
        renderLanguages();
        renderHobbies();
        renderOthers();
        renderRefPersonal();
        renderRefLaboral();
    }

    function formatMonth(value) {
        if (!value) return "";
        const [year, month] = value.split("-");
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        return `${meses[Number(month) - 1]} ${year}`;
    }

    // LISTAS Y AGREGAR ELEMENTOS
    function addToList(btnId, validateFunc, pushFunc, resetIds, renderFunc) {
        $(btnId).addEventListener("click", () => {
            if (validateFunc()) { 
                pushFunc(); 
                limpiarCampos(resetIds); 
                renderFunc(); 
            }
        });
    }

    addToList("add-education-btn", 
        () => $("in-formacion").value.trim() ? true : alert("Escribe el título o formación."),
        () => state.education.push({ title: $("in-formacion").value, school: $("in-centroE").value, location: $("in-localidad").value, start: $("in-fecha-inicio").value, end: $("in-fecha-fin").value }),
        ["in-formacion", "in-centroE", "in-localidad", "in-fecha-inicio", "in-fecha-fin"], renderEducation);

    addToList("add-experience-btn", 
        () => $("in-job").value.trim() && $("in-company").value.trim() ? true : alert("Indica el cargo y empresa."),
        () => state.experience.push({ job: $("in-job").value, company: $("in-company").value, start: $("in-exp-start").value, end: $("in-exp-end").value, description: $("in-exp-description").value }),
        ["in-job", "in-company", "in-exp-start", "in-exp-end", "in-exp-description"], renderExperience);

    // HABILIDADES
    addToList("add-skill-btn", 
        () => $("in-skill").value.trim() ? true : alert("Escribe una habilidad."),
        () => state.skills.push($("in-skill").value.trim()), 
        ["in-skill"], renderSkills);

    // IDIOMAS
    addToList("add-language-btn", 
        () => $("in-language").value.trim() ? true : alert("Escribe un idioma."),
        () => state.languages.push({ language: $("in-language").value, level: $("in-language-level").value }), 
        ["in-language"], renderLanguages);
        
    // AFICIONES
    addToList("add-hobby-btn", 
        () => $("in-hobby").value.trim() ? true : alert("Escribe una afición e interés."),
        () => state.hobbies.push($("in-hobby").value), 
        ["in-hobby"], renderHobbies);

    // OTROS (Con Institución y Fecha)
    addToList("add-other-btn", 
        () => $("in-other").value.trim() ? true : alert("Escribe la descripción o título."),
        () => state.others.push({ 
            title: $("in-other").value.trim(), 
            institution: $("in-other-institution").value.trim(), 
            date: $("in-other-date").value 
        }), 
        ["in-other", "in-other-institution", "in-other-date"], renderOthers);

    // REFERENCIAS PERSONALES
    addToList("add-ref-pers-btn",
        () => $("in-ref-pers-name").value.trim() ? true : alert("Escribe el nombre de la referencia personal."),
        () => state.refPersonal.push({ name: $("in-ref-pers-name").value, phone: $("in-ref-pers-phone").value, email: $("in-ref-pers-email").value }),
        ["in-ref-pers-name", "in-ref-pers-phone", "in-ref-pers-email"], renderRefPersonal);

    // REFERENCIAS LABORALES
    addToList("add-ref-lab-btn",
        () => $("in-ref-lab-name").value.trim() ? true : alert("Escribe el nombre de la referencia laboral."),
        () => state.refLaboral.push({ name: $("in-ref-lab-name").value, phone: $("in-ref-lab-phone").value, email: $("in-ref-lab-email").value }),
        ["in-ref-lab-name", "in-ref-lab-phone", "in-ref-lab-email"], renderRefLaboral);

    // SUGERENCIAS IA PARA HABILIDADES, IDIOMAS Y AFICIONES
    const suggestionsData = {
        skills: ["Liderazgo de equipos", "Pensamiento crítico", "Resolución de problemas", "Gestión del tiempo", "Negociación", "Comunicación asertiva", "Trabajo bajo presión", "Planificación estratégica", "Atención al detalle", "Trabajo en equipo"],
        languages: [
            { language: "Inglés", level: "Básico" },
            { language: "Inglés", level: "Intermedio" },
            { language: "Inglés", level: "Avanzado" },
            { language: "Inglés", level: "Nativo" },
            { language: "Español", level: "Nativo" },
            { language: "Francés", level: "Básico" },
            { language: "Francés", level: "Intermedio" },
            { language: "Alemán", level: "Básico" },
            { language: "Alemán", level: "Intermedio" },
            { language: "Italiano", level: "Básico" }
        ],
        hobbies: ["Lectura", "Fotografía", "Deportes", "Viajes", "Voluntariado social", "Tecnología e innovación", "Escritura creativa", "Ajedrez"]
    };

    function setupMiniAiSuggestions(btnId, containerId, listKey, renderFunc, pushHandler) {
        $(btnId).addEventListener("click", () => {
            const container = $(containerId);
            if (!container.classList.contains("hidden")) {
                container.classList.add("hidden");
                return;
            }
            container.innerHTML = "";
            suggestionsData[listKey].forEach(item => {
                const chip = document.createElement("span");
                chip.className = "suggestion-chip";
                chip.textContent = typeof item === "string" ? item : `${item.language} (${item.level})`;
                chip.onclick = () => {
                    pushHandler(item);
                    renderFunc();
                };
                container.appendChild(chip);
            });
            container.classList.remove("hidden");
        });
    }

    setupMiniAiSuggestions("ai-skill-btn", "skill-suggestions", "skills", renderSkills, 
        item => state.skills.push(item));

    setupMiniAiSuggestions("ai-language-btn", "language-suggestions", "languages", renderLanguages, 
        item => state.languages.push(item));

    setupMiniAiSuggestions("ai-hobby-btn", "hobby-suggestions", "hobbies", renderHobbies, 
        item => state.hobbies.push(item));

    // RENDERIZADO EN PLANTILLA
    function renderEducation() {
        $("education-list").innerHTML = ""; $("out-education").innerHTML = "";
        state.education.forEach((item, i) => {
            $("education-list").innerHTML += `<div class="dynamic-item"><div class="dynamic-item-content"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.school)}</small></div><button class="delete-item" onclick="deleteItem('education', ${i})"><i class="fa-solid fa-trash"></i></button></div>`;
            $("out-education").innerHTML += `<div class="cv-list-item"><h4>${escapeHTML(item.title)}</h4><div class="company">${escapeHTML(item.school)}</div><div class="date">${formatMonth(item.start)}${item.start && item.end ? " — " : ""}${formatMonth(item.end)} ${item.location ? " · " + escapeHTML(item.location) : ""}</div></div>`;
        });
        $("cv-education-section").style.display = state.education.length ? "block" : "none";
    }

    function renderExperience() {
        $("experience-list").innerHTML = ""; $("out-experience").innerHTML = "";
        state.experience.forEach((item, i) => {
            $("experience-list").innerHTML += `<div class="dynamic-item"><div class="dynamic-item-content"><strong>${escapeHTML(item.job)}</strong><small>${escapeHTML(item.company)}</small></div><button class="delete-item" onclick="deleteItem('experience', ${i})"><i class="fa-solid fa-trash"></i></button></div>`;
            $("out-experience").innerHTML += `<div class="cv-list-item"><h4>${escapeHTML(item.job)}</h4><div class="company">${escapeHTML(item.company)}</div><div class="date">${formatMonth(item.start)}${item.start && item.end ? " — " : ""}${formatMonth(item.end)}</div>${item.description ? `<p>${escapeHTML(item.description)}</p>` : ""}</div>`;
        });
        $("cv-experience-section").style.display = state.experience.length ? "block" : "none";
    }

    function renderSkills() {
        $("skills-container").innerHTML = ""; $("out-skills").innerHTML = "";
        state.skills.forEach((skill, i) => {
            $("skills-container").innerHTML += `<div class="skill-tag">${escapeHTML(skill)}<button onclick="deleteItem('skills', ${i})"><i class="fa-solid fa-xmark"></i></button></div>`;
            $("out-skills").innerHTML += `<div class="cv-left-tag"><strong>${escapeHTML(skill)}</strong></div>`;
        });
        $("cv-skills-section").style.display = state.skills.length ? "block" : "none";
    }

    function renderLanguages() {
        $("languages-container").innerHTML = ""; $("out-languages").innerHTML = "";
        state.languages.forEach((item, i) => {
            $("languages-container").innerHTML += `<div class="skill-tag">${escapeHTML(item.language)}<small>${escapeHTML(item.level)}</small><button onclick="deleteItem('languages', ${i})"><i class="fa-solid fa-xmark"></i></button></div>`;
            $("out-languages").innerHTML += `<div class="cv-left-tag"><strong>${escapeHTML(item.language)}</strong><small>${escapeHTML(item.level)}</small></div>`;
        });
        $("cv-languages-section").style.display = state.languages.length ? "block" : "none";
    }

    function renderHobbies() {
        $("hobbies-container").innerHTML = ""; $("out-hobbies").innerHTML = "";
        state.hobbies.forEach((hobby, i) => {
            $("hobbies-container").innerHTML += `<div class="skill-tag">${escapeHTML(hobby)}<button onclick="deleteItem('hobbies', ${i})"><i class="fa-solid fa-xmark"></i></button></div>`;
            $("out-hobbies").innerHTML += `<span class="cv-hobby">${escapeHTML(hobby)}</span>`;
        });
        $("cv-hobbies-section").style.display = state.hobbies.length ? "block" : "none";
    }

    function renderOthers() {
        $("others-container").innerHTML = ""; $("out-others").innerHTML = "";
        state.others.forEach((item, i) => {
            $("others-container").innerHTML += `<div class="dynamic-item"><div class="dynamic-item-content"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.institution)}${item.institution && item.date ? ' · ' : ''}${formatMonth(item.date)}</small></div><button class="delete-item" onclick="deleteItem('others', ${i})"><i class="fa-solid fa-trash"></i></button></div>`;
            $("out-others").innerHTML += `<div class="cv-list-item"><h4>${escapeHTML(item.title)}</h4>${item.institution ? `<div class="company">${escapeHTML(item.institution)}</div>` : ''}${item.date ? `<div class="date">${formatMonth(item.date)}</div>` : ''}</div>`;
        });
        $("cv-other-section").style.display = state.others.length ? "block" : "none";
    }

    function renderRefPersonal() {
        $("ref-pers-list").innerHTML = ""; $("out-ref-pers").innerHTML = "";
        state.refPersonal.forEach((item, i) => {
            $("ref-pers-list").innerHTML += `<div class="dynamic-item"><div class="dynamic-item-content"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.phone)} ${item.email ? '· ' + escapeHTML(item.email) : ''}</small></div><button class="delete-item" onclick="deleteItem('refPersonal', ${i})"><i class="fa-solid fa-trash"></i></button></div>`;
            $("out-ref-pers").innerHTML += `<div class="ref-card"><strong>${escapeHTML(item.name)}</strong>${item.phone ? `<span>Tel: ${escapeHTML(item.phone)}</span>` : ''}${item.email ? `<span>Email: ${escapeHTML(item.email)}</span>` : ''}</div>`;
        });
        $("cv-ref-pers-section").style.display = state.refPersonal.length ? "block" : "none";
    }

    function renderRefLaboral() {
        $("ref-lab-list").innerHTML = ""; $("out-ref-lab").innerHTML = "";
        state.refLaboral.forEach((item, i) => {
            $("ref-lab-list").innerHTML += `<div class="dynamic-item"><div class="dynamic-item-content"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.phone)} ${item.email ? '· ' + escapeHTML(item.email) : ''}</small></div><button class="delete-item" onclick="deleteItem('refLaboral', ${i})"><i class="fa-solid fa-trash"></i></button></div>`;
            $("out-ref-lab").innerHTML += `<div class="ref-card"><strong>${escapeHTML(item.name)}</strong>${item.phone ? `<span>Tel: ${escapeHTML(item.phone)}</span>` : ''}${item.email ? `<span>Email: ${escapeHTML(item.email)}</span>` : ''}</div>`;
        });
        $("cv-ref-lab-section").style.display = state.refLaboral.length ? "block" : "none";
    }

    window.deleteItem = function(listName, index) {
        state[listName].splice(index, 1);
        if (listName === 'education') renderEducation();
        if (listName === 'experience') renderExperience();
        if (listName === 'skills') renderSkills();
        if (listName === 'languages') renderLanguages();
        if (listName === 'hobbies') renderHobbies();
        if (listName === 'others') renderOthers();
        if (listName === 'refPersonal') renderRefPersonal();
        if (listName === 'refLaboral') renderRefLaboral();
    };

    // GENERACIÓN DE PERFIL CON IA
 // =========================================================
    // GENERACIÓN DE PERFIL CON IA Y ROTACIÓN DE SUGERENCIAS
    // =========================================================

    // Índice para alternar entre distintas variaciones de texto
    let profileSuggestionIndex = 0;

    // (Opcional) Si cuentas con una API Key de Google Gemini, puedes colocarla aquí para llamadas en tiempo real
    const GEMINI_API_KEY = ""; 

    async function generarTextoPerfilIA(puesto, empresas, habilidades, indice) {
        // 1. Si se configuró API Key, realiza la petición en vivo a la IA (Gemini)
        if (GEMINI_API_KEY.trim() !== "") {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Escribe un extracto o perfil profesional amplio, redactado en tercera persona, profesional y convincente (de unas 3 a 5 oraciones) para incluir en un CV.
                                Puesto/Profesión: ${puesto}.
                                Experiencia previa: ${empresas || 'amplia trayectoria profesional'}.
                                Habilidades clave: ${habilidades || 'liderazgo, trabajo en equipo y resolución de problemas'}.
                                Genera la variante estilo #${indice + 1} (ej. enfocada en logros, estrategia o liderazgo). Devuelve ÚNICAMENTE el texto del perfil profesional sin introducciones.`
                            }]
                        }]
                    })
                });
                const data = await response.json();
                if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                    return data.candidates[0].content.parts[0].text.trim();
                }
            } catch (err) {
                console.warn("No se pudo conectar con la API externa, utilizando motor local de sugerencias.", err);
            }
        }

        // 2. Motor interno de variaciones amplia y profesional (Funciona de forma inmediata localmente)
        const expTexto = empresas ? `con experiencia destacada en instituciones como ${empresas}` : "con sólida trayectoria en su área de especialización";
        const habTexto = habilidades ? `respaldado por competencias en ${habilidades}` : "con fortalezas clave en liderazgo, pensamiento crítico y gestión de proyectos";

        const variaciones = [
            // Opción 1: Enfoque Estratégico y Ejecución
            `Profesional altamente calificado en ${puesto.toLowerCase()}, ${expTexto}. Se distingue por un enfoque estratégico en la optimización de procesos, la resolución analítica de problemas y el liderazgo de proyectos de alto impacto. Cuenta con excelente capacidad de adaptación y comunicación, ${habTexto}. Orientado al cumplimiento riguroso de objetivos organizacionales y enfocado en agregar valor continuo al desarrollo de la institución.`,

            // Opción 2: Enfoque en Innovación, Trabajo en Equipo y Resultados
            `Especialista proactivo y orientado a resultados en ${puesto.toLowerCase()}. A lo largo de su desempeño ${expTexto}, se ha caracterizado por su visión integral para transformar retos complejos en soluciones operativas eficientes. Combina una mentalidad analítica con rigurosidad técnica, ${habTexto}. Apasionado por la excelencia profesional y la colaboración en entornos de alto rendimiento.`,

            // Opción 3: Enfoque Ejecutivo y Liderazgo
            `Líder dinámico con perfil integral en el área de ${puesto.toLowerCase()}, ${expTexto}. Demuestra aptitudes probadas para la coordinación de equipos multidisciplinarios, la negociación asertiva y la toma de decisiones fundamentadas. Su propuesta de valor integra ética profesional y visión global, ${habTexto}. Motivado por asumir nuevos desafíos donde pueda potenciar la productividad e impulsar la mejora continua.`,

            // Opción 4: Enfoque en Competencias y Propuesta de Valor
            `Profesional enfocado en el desarrollo estratégico e innovación en ${puesto.toLowerCase()}. Con trayectoria ${expTexto}, destaca por su compromiso con la calidad y la entrega oportuna de resultados. Posee gran solvencia técnica, ${habTexto}, lo que le permite adaptarse rápidamente a dinámicas de trabajo exigentes y contribuir de manera determinante al posicionamiento competitivo de la organización.`
        ];

        return variaciones[indice % variaciones.length];
    }

    // Listener del botón "Generar"
    $("ai-generate-btn").addEventListener("click", async () => {
        const btn = $("ai-generate-btn");
        const box = $("ai-suggestion-box");
        const text = $("ai-suggestion-text");

        const title = $("in-title").value.trim() || "profesional";
        const empresas = state.experience.map(e => e.company).filter(Boolean).slice(0, 2).join(" y ");
        const habilidades = state.skills.slice(0, 4).join(", ").toLowerCase();

        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generando...`;

        // Genera el texto más amplio para la variación actual
        const nuevaSugerencia = await generarTextoPerfilIA(title, empresas, habilidades, profileSuggestionIndex);

        text.textContent = nuevaSugerencia;
        box.classList.remove("hidden");

        // Incrementa el índice para que al volver a presionar otorgue la siguiente opción
        profileSuggestionIndex++;

        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Otra sugerencia`;
    });

    $("accept-suggestion-btn").addEventListener("click", () => {
        $("profile-description").value = $("ai-suggestion-text").textContent;
        $("ai-suggestion-box").classList.add("hidden");
        actualizarCV();
    });

    // CAMBIO DE PLANTILLAS Y PALETAS DE COLOR
    $("change-design-btn").addEventListener("click", () => $("design-modal").classList.remove("hidden"));
    $("close-design-modal").addEventListener("click", () => $("design-modal").classList.add("hidden"));

    const themeColors = {
        modern: { accent: "#2563eb", dark: "#172033", text: "#1f2937" },
        executive: { accent: "#111827", dark: "#111827", text: "#111827" },
        creative: { accent: "#7c3aed", dark: "#4c1d95", text: "#1f2937" },
        minimal: { accent: "#334155", dark: "#ffffff", text: "#0f172a" },
        ats: { accent: "#000000", dark: "#ffffff", text: "#000000" },
        timeline: { accent: "#0f766e", dark: "#0f172a", text: "#1f2937" }
    };

    document.querySelectorAll(".design-option").forEach(button => {
        button.addEventListener("click", () => {
            const nombre = button.dataset.design;
            const doc = $("cv-document");
            doc.className = `a4-sheet design-${nombre}`;
            state.design = nombre;

            if(themeColors[nombre]) {
                const colors = themeColors[nombre];
                $("in-color-accent").value = colors.accent;
                $("in-color-dark").value = colors.dark;
                $("in-color-text").value = colors.text;
                doc.style.setProperty("--accent", colors.accent);
                doc.style.setProperty("--cv-dark", colors.dark);
                doc.style.setProperty("--cv-text", colors.text);
            }
            $("design-modal").classList.add("hidden");
        });
    });

    // EXPORTACIÓN Y DESCARGAS (PDF Y WORD)
    $("download-btn").addEventListener("click", () => $("download-modal").classList.remove("hidden"));
    $("close-download-modal").addEventListener("click", () => $("download-modal").classList.add("hidden"));

    // DESCARGAR PDF
    $("download-pdf").addEventListener("click", async () => {
        const element = $("cv-document");
        $("download-modal").classList.add("hidden");
        const options = {
            margin: 0,
            filename: construirNombreArchivo() + ".pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] }
        };
        await html2pdf().set(options).from(element).save();
    });

    // DESCARGAR WORD (.DOCX)
    $("download-word").addEventListener("click", () => {
        $("download-modal").classList.add("hidden");

        const colorAccent = $("cv-document").style.getPropertyValue("--accent") || "#2563eb";
        const colorDark = $("cv-document").style.getPropertyValue("--cv-dark") || "#172033";
        const colorText = $("cv-document").style.getPropertyValue("--cv-text") || "#1f2937";
        const isMinimalOrATS = state.design === "minimal" || state.design === "ats";
        
        let imgHTML = "";
        const imgEl = $("out-avatar");
        if (imgEl.src && imgEl.src.startsWith("data:image")) {
            imgHTML = `<img src="${imgEl.src}" width="120" height="120" style="border-radius:50%; margin-bottom: 20px;">`;
        }

        const htmlWord = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: ${colorText}; }
                table { width: 100%; border-collapse: collapse; }
                td { vertical-align: top; }
                .left-pane { width: 30%; background-color: ${isMinimalOrATS ? '#ffffff' : colorDark}; color: ${isMinimalOrATS ? colorText : '#fff'}; padding: 20px; }
                .right-pane { width: 70%; padding: 30px; color: ${colorText}; }
                .accent-text { color: ${colorAccent}; }
                .section-title { color: ${colorAccent}; border-bottom: 2px solid ${colorAccent}; text-transform: uppercase; font-size: 13px; margin-top: 15px; margin-bottom: 8px; padding-bottom: 4px; font-weight: bold; }
                .left-title { color: ${isMinimalOrATS ? colorAccent : '#fff'}; border-bottom: 1px solid rgba(255,255,255,0.3); text-transform: uppercase; font-size: 11px; margin-bottom: 8px; padding-bottom: 4px; font-weight: bold; }
                .item-title { font-weight: bold; font-size: 13px; color: ${colorText}; margin-top: 8px; }
                .item-subtitle { color: ${colorAccent}; font-weight: bold; font-size: 11px; }
                .item-date { color: #666; font-size: 10px; margin-bottom: 4px; }
            </style>
        </head>
        <body>
            <table>
                <tr>
                    ${!isMinimalOrATS ? `
                    <td class="left-pane">
                        <div style="text-align: center;">${imgHTML}</div>
                        <h4 class="left-title">Contacto</h4>
                        <p style="font-size:11px; line-height: 1.4;">
                            ${$("out-email").textContent}<br>
                            ${$("out-tele").textContent}<br>
                            ${$("out-dire").textContent}
                        </p>
                        ${state.languages.length ? `<h4 class="left-title" style="margin-top:15px;">Idiomas</h4>
                        <p style="font-size:11px; line-height: 1.4;">
                            ${state.languages.map(l => `<strong>${escapeHTML(l.language)}</strong>:${escapeHTML(l.level)}`).join('<br>')}
                        </p>` : ''}
                        ${state.skills.length ? `<h4 class="left-title" style="margin-top:15px;">Habilidades</h4>
                        <p style="font-size:11px; line-height: 1.4;">
                            ${state.skills.map(s => `• ${escapeHTML(s)}`).join('<br>')}
                        </p>` : ''}
                        ${state.hobbies.length ? `<h4 class="left-title" style="margin-top:15px;">Intereses</h4>
                        <p style="font-size:11px; line-height: 1.4;">
                            ${state.hobbies.map(h => escapeHTML(h)).join(', ')}
                        </p>` : ''}
                    </td>` : ''}

                    <td class="right-pane" ${isMinimalOrATS ? 'colspan="2"' : ''}>
                        <h1 style="font-size: 30px; margin-bottom: 5px; color: ${colorText};">${$("out-fullname").textContent}</h1>
                        <h2 class="accent-text" style="font-size: 15px; margin-bottom: 20px;">${$("out-title").textContent}</h2>

                        <h3 class="section-title">Perfil profesional</h3>
                        <p style="font-size: 11px; line-height: 1.5; color: ${colorText};">${$("out-profile-description").textContent}</p>

                        ${state.experience.length ? `<h3 class="section-title">Experiencia laboral</h3>
                        ${state.experience.map(e => `
                            <div>
                                <div class="item-title">${escapeHTML(e.job)}</div>
                                <div class="item-subtitle">${escapeHTML(e.company)}</div>
                                <div class="item-date">${formatMonth(e.start)} - ${formatMonth(e.end)}</div>
                                <p style="font-size: 11px; margin-top: 4px; color: ${colorText};">${escapeHTML(e.description)}</p>
                            </div>
                        `).join('')}` : ''}

                        ${state.education.length ? `<h3 class="section-title">Formación</h3>
                        ${state.education.map(e => `
                            <div>
                                <div class="item-title">${escapeHTML(e.title)}</div>
                                <div class="item-subtitle">${escapeHTML(e.school)}</div>
                                <div class="item-date">${formatMonth(e.start)} - ${formatMonth(e.end)} | ${escapeHTML(e.location)}</div>
                            </div>
                        `).join('')}` : ''}

                        ${state.others.length ? `<h3 class="section-title">Otros</h3>
                        ${state.others.map(o => `
                            <div>
                                <div class="item-title">${escapeHTML(o.title)}</div>
                                ${o.institution ? `<div class="item-subtitle">${escapeHTML(o.institution)}</div>` : ''}
                                ${o.date ? `<div class="item-date">${formatMonth(o.date)}</div>` : ''}
                            </div>
                        `).join('')}` : ''}

                        ${state.refPersonal.length ? `<h3 class="section-title">Referencias Personales</h3>
                        <p style="font-size: 11px; color: ${colorText};">
                            ${state.refPersonal.map(r => `<strong>${escapeHTML(r.name)}</strong> - Tel: ${escapeHTML(r.phone)} | Email: ${escapeHTML(r.email)}`).join('<br>')}
                        </p>` : ''}

                        ${state.refLaboral.length ? `<h3 class="section-title">Referencias Laborales</h3>
                        <p style="font-size: 11px; color: ${colorText};">
                            ${state.refLaboral.map(r => `<strong>${escapeHTML(r.name)}</strong> - Tel: ${escapeHTML(r.phone)} | Email: ${escapeHTML(r.email)}`).join('<br>')}
                        </p>` : ''}
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        const blob = htmlDocx.asBlob(htmlWord);
        saveAs(blob, construirNombreArchivo() + ".docx");
    });

    // UTILIDADES
    function limpiarCampos(ids) {
        ids.forEach(id => { if ($(id))$(id).value = ""; });
    }
    function escapeHTML(value) {
        return String(value || "").replace(/[&<>"']/g, char => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"}[char]));
    }
    function construirNombreArchivo() {
        const base = `${$("in-name").value.trim()}_${$("in-lastname").value.trim()}`.replace(/\s+/g, "_");
        return base || "CV_Profesional";
    }

    // CERRAR MODALES AL HACER CLIC FUERA
    document.querySelectorAll(".modal-overlay").forEach(modal => {
        modal.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });
    });

    actualizarCV();
});