let roteiro = [];
let routeLine = null;

const bounds = [
    [28.0, -35.0], 
    [45.0, -5.0]   
];

const map = L.map('map', {
    maxBounds: bounds,
    maxBoundsViscosity: 0.8,
    minZoom: 5
}).setView([39.5, -8.0], 6);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 12,
    minZoom: 5
}).addTo(map);

const wikiCache = {};

async function fetchWikiImage(wikiTitle) {
    if (!wikiTitle) return null;
    if (wikiCache[wikiTitle]) return wikiCache[wikiTitle];
    try {
        const url = `https://pt.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
        const response = await fetch(url);
        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId !== "-1" && pages[pageId].thumbnail) {
            wikiCache[wikiTitle] = pages[pageId].thumbnail.source;
            return wikiCache[wikiTitle];
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}

const locations = [
    {
        id: 1, name: "Centro Histórico do Porto", coords: [41.143, -8.611], category: "Patrimônio Mundial", filter: "patrimonio",
        tradition: "Arquitetura monumental e Vinho do Porto", impact: "Dinamiza o turismo e impulsiona a economia vinícola tradicional.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Centro_Histórico_do_Porto"
    },
    {
        id: 2, name: "Mosteiro dos Jerónimos", coords: [38.697, -9.206], category: "Patrimônio Mundial", filter: "patrimonio",
        tradition: "Estilo Manuelino e Era dos Descobrimentos", impact: "Pólo turístico crucial que financia a conservação de monumentos.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Mosteiro_dos_Jerónimos"
    },
    {
        id: 3, name: "Universidade de Coimbra", coords: [40.207, -8.426], category: "Patrimônio Mundial", filter: "patrimonio",
        tradition: "Tradições Acadêmicas e Fado de Coimbra", impact: "Atrai estudantes internacionais e fomenta a economia do conhecimento.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Universidade_de_Coimbra"
    },
    {
        id: 4, name: "Centro Histórico de Évora", coords: [38.571, -7.909], category: "Patrimônio Mundial", filter: "patrimonio",
        tradition: "Ruínas Romanas e Arquitetura Alentejana", impact: "Turismo cultural ajuda a conter a desertificação do interior.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Centro_Histórico_de_Évora"
    },
    {
        id: 5, name: "Paisagem Cultural de Sintra", coords: [38.799, -9.390], category: "Patrimônio Mundial", filter: "patrimonio",
        tradition: "Romantismo Arquitetônico e Botânica", impact: "Modelo de conservação ambiental gerando fundos vitais.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Palácio_Nacional_da_Pena"
    },
    {
        id: 6, name: "Convento de Cristo", coords: [39.603, -8.419], category: "Patrimônio Mundial", filter: "patrimonio",
        tradition: "Herança dos Cavaleiros Templários", impact: "Estimula a revitalização da economia regional no centro.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Convento_de_Cristo"
    },
    {
        id: 15, name: "Centro Histórico de Guimarães", coords: [41.442, -8.293], category: "Patrimônio Mundial", filter: "patrimonio",
        tradition: "Arquitetura Medieval", impact: "Símbolo da fundação da nação que sustenta grande economia criativa.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Centro_Histórico_de_Guimarães"
    },
    {
        id: 16, name: "Mosteiro da Batalha", coords: [39.658, -8.825], category: "Patrimônio Mundial", filter: "patrimonio",
        tradition: "Obra-prima do Gótico", impact: "Atrai investigadores e entusiastas de arquitetura do mundo todo.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Mosteiro_da_Batalha"
    },
    {
        id: 18, name: "Alto Douro Vinhateiro", coords: [41.166, -7.533], category: "Patrimônio Mundial", filter: "patrimonio",
        tradition: "Paisagem cultural de produção de vinho", impact: "Sustenta o forte comércio de exportação vitivinícola global.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Região_Vinhateira_do_Alto_Douro"
    },
    {
        id: 19, name: "Angra do Heroísmo (Açores)", coords: [38.653, -27.218], category: "Patrimônio Mundial", filter: "patrimonio",
        tradition: "Escala nas navegações do Atlântico", impact: "Turismo oceânico que valoriza a preservação biológica das ilhas.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Centro_Histórico_de_Angra_do_Heroísmo"
    },
    {
        id: 20, name: "Laurissilva da Madeira", coords: [32.766, -17.0], category: "Patrimônio Mundial (Natural)", filter: "patrimonio",
        tradition: "Floresta relíquia do período Terciário", impact: "Garante a retenção de água e o ecoturismo na Madeira.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Floresta_laurissilva_da_Ilha_da_Madeira"
    },
    {
        id: 21, name: "Palácio de Mafra", coords: [38.936, -9.326], category: "Patrimônio Mundial", filter: "patrimonio",
        tradition: "Arquitetura barroca", impact: "Consolida a zona saloia como destino cultural de excelência.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Palácio_Nacional_de_Mafra"
    },
    {
        id: 7, name: "Óbidos", coords: [39.362, -9.157], category: "Cidade da Literatura", filter: "criativas",
        tradition: "Festivais literários", impact: "Criou uma microeconomia voltada inteiramente para a leitura.",
        colorClass: "text-vibrant-yellow", bgClass: "bg-yellow-50", hex: "#eab308", wikiTitle: "Óbidos_(Portugal)"
    },
    {
        id: 8, name: "Braga", coords: [41.550, -8.420], category: "Cidade das Media Arts", filter: "criativas",
        tradition: "Arte Digital", impact: "Retém talentos jovens e atrai startups focadas em novas mídias.",
        colorClass: "text-vibrant-green", bgClass: "bg-green-50", hex: "#22c55e", wikiTitle: "Braga"
    },
    {
        id: 9, name: "Caldas da Rainha", coords: [39.406, -9.136], category: "Cidade do Artesanato", filter: "criativas",
        tradition: "Cerâmica Tradicional", impact: "Fomenta a exportação internacional de faianças artísticas.",
        colorClass: "text-vibrant-orange", bgClass: "bg-orange-50", hex: "#f97316", wikiTitle: "Caldas_da_Rainha"
    },
    {
        id: 10, name: "Amarante", coords: [41.272, -8.082], category: "Cidade da Música", filter: "criativas",
        tradition: "Jazz e Música Clássica", impact: "Garante educação musical contínua para milhares de jovens locais.",
        colorClass: "text-vibrant-orange", bgClass: "bg-orange-50", hex: "#f97316", wikiTitle: "Amarante_(Portugal)"
    },
    {
        id: 11, name: "Idanha-a-Nova", coords: [39.923, -7.241], category: "Cidade da Música", filter: "criativas",
        tradition: "Instrumentos Tradicionais", impact: "Ativa a economia de festivais rurais massivos sustentáveis.",
        colorClass: "text-vibrant-orange", bgClass: "bg-orange-50", hex: "#f97316", wikiTitle: "Idanha-a-Nova"
    },
    {
        id: 12, name: "Barcelos", coords: [41.533, -8.616], category: "Cidade do Artesanato", filter: "criativas",
        tradition: "Olaria e o Galo", impact: "Espinha dorsal do comércio artesanal em todo o norte de Portugal.",
        colorClass: "text-vibrant-green", bgClass: "bg-green-50", hex: "#22c55e", wikiTitle: "Barcelos"
    },
    {
        id: 23, name: "Covilhã", coords: [40.282, -7.502], category: "Cidade do Design", filter: "criativas",
        tradition: "Indústria Têxtil", impact: "Reconversão de antigas fábricas em modernos polos de arte urbana.",
        colorClass: "text-unesco-blue", bgClass: "bg-blue-50", hex: "#005bbb", wikiTitle: "Covilhã"
    }
];

const createIcon = (color) => {
    return L.divIcon({
        className: 'custom-pin-wrapper bg-transparent border-none',
        html: `
            <div class="relative w-9 h-9 flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-[1.2]">
                <span class="absolute inline-flex h-full w-full rounded-full opacity-40 animate-ping" style="background-color: ${color}; animation-duration: 2s;"></span>
                <span class="absolute inline-flex h-6 w-6 rounded-full opacity-50 blur-sm" style="background-color: ${color};"></span>
                <svg class="relative z-10 drop-shadow-xl" width="36" height="36" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        tooltipAnchor: [0, -36]
    });
};

let markers = [];

function renderMap(filter = 'all') {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    locations.forEach(loc => {
        if (filter !== 'all' && loc.filter !== filter) return;

        const marker = L.marker(loc.coords, { icon: createIcon(loc.hex) }).addTo(map);
        
        marker.bindTooltip(`<span class="font-bold font-sans text-sm">${loc.name}</span>`, {
            direction: 'top',
            className: 'bg-slate-900 text-white shadow-xl rounded-lg border-none px-3 py-1.5',
            offset: [0, -35]
        });

        marker.on('click', () => {
            const isIsland = loc.coords[1] < -10;
            const targetZoom = isIsland ? 9 : 10;
            map.flyTo(loc.coords, targetZoom, { duration: 1.5, easeLinearity: 0.25 });
            updateInfoPanel(loc);
        });

        markers.push(marker);
    });
}

function getRouteButtonHTML(locId) {
    const isAdded = roteiro.find(item => item.id === locId);
    if (isAdded) {
        return `<button onclick="removeFromRoteiro(${locId}); updateInfoPanelCached(${locId})" class="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center gap-2 mt-3 border border-red-200 shadow-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
            Remover do Roteiro
        </button>`;
    } else {
        return `<button onclick="addToRoteiro(${locId}); updateInfoPanelCached(${locId})" class="w-full py-4 bg-vibrant-green hover:bg-green-600 text-white rounded-xl font-semibold transition-colors duration-300 shadow-lg flex items-center justify-center gap-2 mt-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Adicionar ao Roteiro
        </button>`;
    }
}

async function updateInfoPanelCached(locId) {
    const loc = locations.find(l => l.id === locId);
    updateInfoPanel(loc, true);
}

async function updateInfoPanel(loc, skipAnimation = false) {
    const panel = document.getElementById('info-panel');
    const fallbackImage = loc.filter === 'patrimonio' ? 'assets/portugal_patrimonio_1779267136482.png' : 'assets/portugal_criativa_1779267150792.png';

    if (!skipAnimation) {
        panel.style.opacity = '0';
        setTimeout(() => {
            panel.innerHTML = `
                <div class="flex flex-col h-full w-full text-left overflow-hidden">
                    <div class="w-full h-48 md:h-56 bg-slate-200 animate-pulse rounded-t-[2rem]"></div>
                    <div class="p-6 md:p-8 flex flex-col flex-grow">
                        <div class="h-8 bg-slate-200 rounded animate-pulse w-3/4 mb-6"></div>
                        <div class="space-y-4">
                            <div class="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>
                            <div class="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            `;
            panel.classList.remove('justify-center', 'items-center', 'text-center');
            panel.style.opacity = '1';
        }, 200);
    }

    const wikiImage = await fetchWikiImage(loc.wikiTitle);
    const finalImage = wikiImage ? wikiImage : fallbackImage;

    const renderHtml = () => {
        panel.innerHTML = `
            <div class="flex flex-col h-full w-full text-left overflow-y-auto hide-scrollbar animate-fade-in-up">
                <div class="w-full h-48 md:h-56 shrink-0 relative overflow-hidden rounded-t-[2rem]">
                    <img src="${finalImage}" class="w-full h-full object-cover" alt="${loc.category}">
                    <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                    <div class="absolute bottom-4 left-6">
                        <span class="inline-block px-4 py-1.5 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm border border-slate-100">
                            ${loc.category}
                        </span>
                    </div>
                </div>
                
                <div class="p-6 md:p-8 flex flex-col flex-grow">
                    <h2 class="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6 leading-tight">${loc.name}</h2>
                    
                    <div class="space-y-6 flex-grow">
                        <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <svg class="w-4 h-4 text-unesco-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                Tradição e Cultura
                            </h4>
                            <p class="text-lg text-slate-800 font-medium leading-relaxed">${loc.tradition}</p>
                        </div>
                        <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <svg class="w-4 h-4 text-vibrant-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Impacto Sustentável
                            </h4>
                            <p class="text-slate-600 leading-relaxed">${loc.impact}</p>
                        </div>
                    </div>
                    
                    <div class="mt-8 pt-6 border-t border-slate-100 shrink-0">
                        <button onclick="resetPanel()" class="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors duration-300 shadow-premium flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Voltar à Visão Geral
                        </button>
                        ${getRouteButtonHTML(loc.id)}
                    </div>
                </div>
            </div>
        `;
    };

    if (!skipAnimation) {
        setTimeout(renderHtml, 400);
    } else {
        renderHtml();
    }
}

function resetPanel() {
    map.flyTo([39.5, -8.0], 6, { duration: 1.5, easeLinearity: 0.25 });
    const panel = document.getElementById('info-panel');
    panel.style.opacity = '0';
    setTimeout(() => {
        panel.innerHTML = document.getElementById('default-panel-template').innerHTML;
        panel.classList.add('justify-center', 'items-center', 'text-center');
        panel.style.opacity = '1';
    }, 300);
}

window.addToRoteiro = function(locId) {
    const loc = locations.find(l => l.id === locId);
    if (loc && !roteiro.find(l => l.id === locId)) {
        roteiro.push(loc);
        updateRoteiroUI();
    }
}

window.removeFromRoteiro = function(locId) {
    roteiro = roteiro.filter(l => l.id !== locId);
    updateRoteiroUI();
}

function updateRoteiroUI() {
    document.getElementById('roteiro-count').innerText = roteiro.length;
    drawRouteLine();
}

function drawRouteLine() {
    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
    if (roteiro.length > 1) {
        const latlngs = roteiro.map(loc => loc.coords);
        routeLine = L.polyline(latlngs, {
            color: '#005bbb',
            weight: 4,
            dashArray: '8, 8',
            opacity: 0.8
        }).addTo(map);
    }
}

window.showRoteiro = function() {
    if (roteiro.length === 0) {
        alert("O seu Roteiro está vazio. Clique nos locais no mapa para adicionar paradas!");
        return;
    }
    
    const latlngs = roteiro.map(loc => loc.coords);
    const routeBounds = L.latLngBounds(latlngs);
    map.fitBounds(routeBounds, { padding: [50, 50] });

    const panel = document.getElementById('info-panel');
    panel.style.opacity = '0';
    
    let routeHTML = roteiro.map((loc, index) => `
        <div class="flex items-center gap-4 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer" onclick="map.flyTo([${loc.coords}], 10)">
            <div class="w-8 h-8 rounded-full bg-unesco-blue text-white flex items-center justify-center font-bold text-sm shrink-0">
                ${index + 1}
            </div>
            <div>
                <h4 class="font-bold text-slate-800">${loc.name}</h4>
                <p class="text-xs text-slate-500">${loc.category}</p>
            </div>
            <button onclick="event.stopPropagation(); removeFromRoteiro(${loc.id}); showRoteiro();" class="ml-auto text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="Remover">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `).join('');

    setTimeout(() => {
        panel.innerHTML = `
            <div class="flex flex-col h-full w-full text-left overflow-y-auto hide-scrollbar animate-fade-in-up p-8">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-14 h-14 rounded-full bg-blue-100 text-unesco-blue flex items-center justify-center">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                    </div>
                    <div>
                        <h2 class="text-3xl font-display font-bold text-slate-900">Meu Roteiro</h2>
                        <p class="text-slate-500 text-sm">${roteiro.length} paradas selecionadas</p>
                    </div>
                </div>
                
                <div class="flex-grow pb-4 border-t border-slate-100 pt-6">
                    ${routeHTML}
                </div>
                
                <div class="mt-auto pt-6 border-t border-slate-100 shrink-0">
                    <button onclick="resetPanel()" class="w-full py-4 bg-slate-900 hover:bg-unesco-blue text-white rounded-xl font-semibold transition-colors duration-300 shadow-premium flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Voltar à Visão Geral
                    </button>
                </div>
            </div>
        `;
        panel.classList.remove('justify-center', 'items-center', 'text-center');
        panel.style.opacity = '1';
    }, 300);
}

renderMap();

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active', 'text-slate-900');
            b.classList.add('text-slate-500');
        });
        e.target.classList.remove('text-slate-500');
        e.target.classList.add('active', 'text-slate-900');

        const filter = e.target.getAttribute('data-filter');
        renderMap(filter);
        resetPanel();
        drawRouteLine();
    });
});
