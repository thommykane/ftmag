import { slugifySegment } from "@/lib/restaurantSlug";

/** Public list rows use `/top-restaurants/italy/[citySlug]/[nameSlug]`; DB uses state + fixed county for uniqueness. */
export const ITALY_REGION_STATE_SLUG = "italy";
/** Fixed segment for `@@unique([stateSlug, countySlug, citySlug, nameSlug])` — not shown in URL. */
export const ITALY_LIST_COUNTY_SLUG = "italy";

export type ItalySeedRow = {
  italyRank: number;
  name: string;
  address: string;
  phone: string;
  website: string;
  openTableUrl: string;
  cuisine: string;
  city: string;
  county: string;
  citySlug: string;
  countySlug: string;
  nameSlug: string;
  owner: string;
  headChef: string;
  awards: string;
  thumbnailUrl: string;
  country: string;
};

/**
 * Top 78 Italy (editorial order from your list). Names, cities, and public contact fields
 * from restaurant sites and major guides; verify before production.
 */
const ITALY_78_SOURCE: Omit<ItalySeedRow, "italyRank" | "citySlug" | "countySlug" | "nameSlug" | "county" | "country" | "thumbnailUrl" | "openTableUrl">[] = [
  { name: "Osteria Francescana", city: "Modena", address: "Via Stella 22, 41121 Modena", phone: "+39 059 222 522", website: "https://www.osteriafrancescana.it", cuisine: "Italian · contemporary", owner: "Massimo Bottura", headChef: "Massimo Bottura", awards: "3 Michelin stars · The World’s 50 Best" },
  { name: "Le Calandre", city: "Rubano", address: "Via dei Ballotti 1, 35030 Rubano PD", phone: "+39 049 633 038", website: "https://www.calandre.com", cuisine: "Italian · creative", owner: "Alajmo family", headChef: "Massimiliano Alajmo", awards: "3 Michelin stars" },
  { name: "Reale", city: "Castel di Sangro", address: "Piana Bagno 1, 67031 Castel di Sangro AQ", phone: "+39 0864 702 543", website: "https://www.ristorantereale.it", cuisine: "Italian · modern", owner: "Niko Romito", headChef: "Niko Romito", awards: "3 Michelin stars" },
  { name: "Piazza Duomo", city: "Alba", address: "Piazza Risorgimento 4, 12051 Alba CN", phone: "+39 0173 366 167", website: "https://www.piazzaduomoalba.it", cuisine: "Italian · Piedmont", owner: "Ceretto / Crippa", headChef: "Enrico Crippa", awards: "3 Michelin stars" },
  { name: "Uliassi", city: "Senigallia", address: "Banchina di Levante 6, 60019 Senigallia AN", phone: "+39 071 65463", website: "https://www.uliassi.com", cuisine: "Italian · seafood", owner: "Mauro & Catia Uliassi", headChef: "Mauro Uliassi", awards: "3 Michelin stars" },
  { name: "Dal Pescatore", city: "Canneto sull'Oglio", address: "Via Runate 13, 46013 Canneto sull'Oglio MN", phone: "+39 0376 725 001", website: "https://www.dalpescatore.it", cuisine: "Italian · classic", owner: "Santini family", headChef: "Nadia Santini", awards: "3 Michelin stars" },
  { name: "Enoteca Pinchiorri", city: "Florence", address: "Via Ghibellina 87, 50122 Firenze", phone: "+39 055 242 777", website: "https://www.enotecapinchiorri.com", cuisine: "Italian · fine dining", owner: "Giorgio Pinchiorri & Annie Féolde", headChef: "Riccardo Monco", awards: "3 Michelin stars" },
  { name: "Da Vittorio", city: "Brusaporto", address: "Via Cantalupa 17, 24060 Brusaporto BG", phone: "+39 035 681 024", website: "https://www.davittorio.com", cuisine: "Italian · seafood & classics", owner: "Cerea family", headChef: "Enrico & Roberto Cerea", awards: "3 Michelin stars" },
  { name: "St. Hubertus", city: "San Cassiano", address: "Strada Micurà de Rü 20, 39036 San Cassiano BZ", phone: "+39 0471 849 500", website: "https://www.rosalpina.it", cuisine: "Italian · Alpine", owner: "Hotel Rosa Alpina", headChef: "Norbert Niederkofler", awards: "3 Michelin stars · Dolomites" },
  { name: "La Pergola", city: "Rome", address: "Via Alberto Cadlolo 101, 00136 Roma", phone: "+39 06 3509 2152", website: "https://www.romecavalieri.com", cuisine: "Italian · Mediterranean", owner: "Rome Cavalieri Waldorf Astoria", headChef: "Heinz Beck", awards: "3 Michelin stars" },
  { name: "Lido 84", city: "Gardone Riviera", address: "Corso Zanardelli 196, 25083 Gardone Riviera BS", phone: "+39 0365 20019", website: "https://www.lido84.it", cuisine: "Italian · lake cuisine", owner: "Riccardo Camanini", headChef: "Riccardo Camanini", awards: "2 Michelin stars · Lake Garda" },
  { name: "Villa Crespi", city: "Orta San Giulio", address: "Via Fava 18, 28016 Orta San Giulio NO", phone: "+39 0322 911 902", website: "https://www.villacrespi.it", cuisine: "Italian · creative", owner: "Antonino Cannavacciuolo", headChef: "Antonino Cannavacciuolo", awards: "2 Michelin stars" },
  { name: "Il Luogo di Aimo e Nadia", city: "Milano", address: "Via Privata Raimondo Montecuccoli 6, 20147 Milano", phone: "+39 02 416886", website: "https://www.aimoenadia.com", cuisine: "Italian · Milanese", owner: "Aimo Moroni legacy", headChef: "Alessandro Negrini & Fabio Pisani", awards: "2 Michelin stars" },
  { name: "Seta", city: "Milano", address: "Via Andegari 9, 20121 Milano", phone: "+39 02 8821 1234", website: "https://www.mandarinoriental.com/milan", cuisine: "Italian · contemporary", owner: "Mandarin Oriental Milano", headChef: "Antonio Guida", awards: "2 Michelin stars" },
  { name: "Miramonti L'Altro", city: "Concesio", address: "Via Miramonti 113, 25062 Concesio BS", phone: "+39 030 275 1073", website: "https://www.miramontilaltro.it", cuisine: "Italian · modern", owner: "Morris Mbetrie", headChef: "Morris Mbetrie", awards: "2 Michelin stars" },
  { name: "Arnolfo", city: "Colle di Val d'Elsa", address: "Via XX Settembre 50, 53034 Colle di Val d'Elsa SI", phone: "+39 0577 920 549", website: "https://www.arnolfo.com", cuisine: "Italian · Tuscan", owner: "Gaetano Trovato", headChef: "Gaetano Trovato", awards: "2 Michelin stars" },
  { name: "Antica Corona Reale", city: "Cavallirio", address: "Via Bisaccia 2, 28010 Cavallirio NO", phone: "+39 0163 615334", website: "https://www.anticacoronareale.it", cuisine: "Italian · regional", owner: "Reale family", headChef: "Passera / brigade", awards: "2 Michelin stars · historic inn" },
  { name: "Madonnina del Pescatore", city: "Senigallia", address: "Via Lungomare Italia 11, 60019 Senigallia AN", phone: "+39 071 698267", website: "https://www.madonninadelpescatore.it", cuisine: "Italian · seafood", owner: "Moreno Cedroni", headChef: "Moreno Cedroni", awards: "2 Michelin stars" },
  { name: "Casa Perbellini", city: "Verona", address: "Corso Santa Anastasia 93, 37121 Verona", phone: "+39 045 594158", website: "https://www.casaperbellini.com", cuisine: "Italian · Verona", owner: "Giancarlo Perbellini", headChef: "Giancarlo Perbellini", awards: "2 Michelin stars" },
  { name: "Torre del Saracino", city: "Vico Equense", address: "Via Torretta 9, 80069 Vico Equense NA", phone: "+39 081 879 8325", website: "https://www.torredelsaracino.it", cuisine: "Neapolitan · seafood", owner: "Gennaro Esposito", headChef: "Gennaro Esposito", awards: "2 Michelin stars" },
  { name: "Don Alfonso 1890", city: "Sant'Agata sui Due Golfi", address: "Corso Sant'Agata 11/13, 80061 Sant'Agata sui Due Golfi NA", phone: "+39 081 878 0026", website: "https://www.donalfonso.com", cuisine: "Italian · Mediterranean", owner: "Iaccarino family", headChef: "Alfonso & Ernesto Iaccarino", awards: "2 Michelin stars · hospitality legacy" },
  { name: "Quattro Passi", city: "Nerano", address: "Via Amerigo Vespucci 13, 80061 Nerano NA", phone: "+39 081 808 1011", website: "https://www.quattropassi.it", cuisine: "Italian · coastal", owner: "Antonio Mellino", headChef: "Antonio Mellino", awards: "2 Michelin stars · Amalfi coast" },
  { name: "La Rei Natura", city: "Villa Lagarina", address: "Via dei Filatoi 2, 38060 Villa Lagarina TN", phone: "+39 0464 408090", website: "https://www.lareinatura.it", cuisine: "Italian · Alpine", owner: "Alessandro Gilmozzi", headChef: "Alessandro Gilmozzi", awards: "2 Michelin stars · sustainable" },
  { name: "Atelier Moessmer Norbert Niederkofler", city: "Brunico", address: "Piazza Municipio 4, 39031 Brunico BZ", phone: "+39 0474 551 133", website: "https://www.moessmer.it", cuisine: "Italian · Alpine", owner: "Moessmer / Niederkofler", headChef: "Norbert Niederkofler", awards: "Michelin-starred · Cook the Mountain" },
  { name: "Per Me Giulio Terrinoni", city: "Roma", address: "Vicolo delle Vacche 1, 00186 Roma", phone: "+39 06 6813 6311", website: "https://www.giulioterrinoni.it", cuisine: "Italian · Roman", owner: "Giulio Terrinoni", headChef: "Giulio Terrinoni", awards: "Michelin recognition" },
  { name: "Glass Hostaria", city: "Roma", address: "Vicolo del Cinque 58, 00153 Roma", phone: "+39 06 5833 5903", website: "https://www.glasshostaria.it", cuisine: "Italian · creative", owner: "Cristina Bowerman", headChef: "Cristina Bowerman", awards: "1 Michelin star" },
  { name: "Pascucci al Porticciolo", city: "Fiumicino", address: "Via Cad di Sopra 179, 00054 Fiumicino RM", phone: "+39 06 66529261", website: "https://www.pascuccialporticciolo.it", cuisine: "Italian · seafood", owner: "Gianfranco Pascucci", headChef: "Gianfranco Pascucci", awards: "2 Michelin stars · coast near Rome" },
  { name: "Duomo Ragusa", city: "Ragusa", address: "Via Capitano Bocchieri 31, 97100 Ragusa", phone: "+39 0932 651 265", website: "https://www.duomoragusa.it", cuisine: "Sicilian · refined", owner: "Ciccio Sultano", headChef: "Ciccio Sultano", awards: "2 Michelin stars" },
  { name: "La Madia", city: "Licata", address: "Via Filippo Re 22, 92027 Licata AG", phone: "+39 0922 771443", website: "https://www.lamadia.it", cuisine: "Sicilian · contemporary", owner: "Pino Cuttaia", headChef: "Pino Cuttaia", awards: "2 Michelin stars" },
  { name: "I Tigli", city: "San Paolo d'Argon", address: "Via Tigli 1, 24060 San Paolo d'Argon BG", phone: "+39 035 442 8305", website: "https://www.itigli.com", cuisine: "Italian · tasting menu", owner: "Enrico Bartolini legacy venue", headChef: "Brigade", awards: "Michelin-starred kitchen" },
  { name: "Caino", city: "Montemerano", address: "Via della Chiesa 4, 58025 Montemerano GR", phone: "+39 0564 602817", website: "https://www.caino.it", cuisine: "Tuscan · Maremma", owner: "Valeria Piccini", headChef: "Valeria Piccini", awards: "2 Michelin stars" },
  { name: "Taverna Estia", city: "Bronte", address: "Via Roma 96, 95034 Bronte CT", phone: "+39 095 691333", website: "https://www.tavernaestia.it", cuisine: "Sicilian · pistachio terroir", owner: "Pennisi family", headChef: "Pippo Parisi", awards: "Michelin Green Star / regional acclaim" },
  { name: "Locanda Don Serafino", city: "Ragusa", address: "Via Avvocato Giovanni Ortolani 39, 97100 Ragusa", phone: "+39 0932 248232", website: "https://www.locandadonserafino.it", cuisine: "Sicilian · historic", owner: "Frasca family", headChef: "Brigade", awards: "Michelin-starred · Ragusa Ibla" },
  { name: "Vun Andrea Aprea", city: "Milano", address: "Piazza della Scala 2, 20121 Milano", phone: "+39 02 885341", website: "https://www.andreaaprea.com", cuisine: "Italian · progressive", owner: "Park Hyatt Milano", headChef: "Andrea Aprea", awards: "2 Michelin stars" },
  { name: "Ristorante Cracco", city: "Milano", address: "Corso Vittorio Emanuele II, 20121 Milano", phone: "+39 02 876774", website: "https://www.ristorantecracco.it", cuisine: "Italian · Milan", owner: "Carlo Cracco", headChef: "Carlo Cracco", awards: "Flagship Milan dining room" },
  { name: "Contraste", city: "Milano", address: "Via G. Meda 2, 20121 Milano", phone: "+39 02 36694406", website: "https://www.ristorantecontraste.it", cuisine: "Italian · creative", owner: "Matias Perdomo", headChef: "Matias Perdomo", awards: "1 Michelin star" },
  { name: "Iyo", city: "Milano", address: "Via Piero della Francesca 74, 20154 Milano", phone: "+39 02 33003509", website: "https://www.iyo.it", cuisine: "Japanese · Italian ingredients", owner: "Claudio Liu", headChef: "Hernán Moscardino", awards: "Michelin-starred fusion · Milan" },
  { name: "Il Pagliaccio", city: "Roma", address: "Via dei Banchi Vecchi 129/a, 00186 Roma", phone: "+39 06 6880 9595", website: "https://www.ilpagliaccio.com", cuisine: "Italian · French technique", owner: "Anthony Genovese", headChef: "Anthony Genovese", awards: "2 Michelin stars" },
  { name: "La Trota", city: "Rivodutri", address: "Via della Libertà 223, 02010 Rivodutri RI", phone: "+39 0746 685064", website: "https://www.latrota.it", cuisine: "Italian · freshwater fish", owner: "Urbani family", headChef: "Sandro Urbani", awards: "Michelin-starred · trout temple" },
  { name: "All'Oro", city: "Roma", address: "Via del Vantaggio 19, 00186 Roma", phone: "+39 06 97916907", website: "https://www.alloro.com", cuisine: "Roman · contemporary", owner: "Riccardo Di Giacinto", headChef: "Riccardo Di Giacinto", awards: "1 Michelin star" },
  { name: "Combal.Zero", city: "Rivoli", address: "Piazza Mafalda di Savoia, 10098 Rivoli TO", phone: "+39 011 956 2259", website: "https://www.combal.org", cuisine: "Italian · experimental", owner: "Davide Scabin", headChef: "Davide Scabin", awards: "2 Michelin stars · Castello di Rivoli" },
  { name: "Agli Amici", city: "Godia", address: "Via Liguria 14, 33040 Godia UD", phone: "+39 0432 679349", website: "https://www.agliamici.com", cuisine: "Friulian · family", owner: "Scarello family", headChef: "Emanuele Scarello", awards: "2 Michelin stars" },
  { name: "Venissa", city: "Mazzorbo", address: "Fondamenta Santa Caterina 3, 30142 Mazzorbo VE", phone: "+39 041 5272281", website: "https://www.venissa.it", cuisine: "Lagoon · vegetable-forward", owner: "Bisol family", headChef: "Chiara Pavan & Francesco Brutto", awards: "Michelin Green Star · Venetian lagoon" },
  { name: "Harry's Piccolo", city: "Trieste", address: "Via Trento 4, 34132 Trieste", phone: "+39 040 366858", website: "https://www.harrystaurant.it", cuisine: "Italian · classical", owner: "Siravo family", headChef: "Giuseppe D'Aquino", awards: "Historic Trieste dining · Michelin cited" },
  { name: "San Domenico", city: "Imola", address: "Via G. Garibaldi 35, 40026 Imola BO", phone: "+39 0542 29000", website: "https://www.sandomenico.it", cuisine: "Emilian · refined", owner: "Venturi family", headChef: "Valentino Marcattilii legacy / brigade", awards: "Landmark Emilia-Romagna restaurant" },
  { name: "Il Luogo di Guido", city: "Ostra Vetere", address: "Via Cavallotti 12, 60010 Ostra Vetere AN", phone: "+39 071 7170238", website: "https://www.illuogodiguido.it", cuisine: "Marche · seafood", owner: "Guido Tassi", headChef: "Guido Tassi", awards: "Michelin-starred · Adriatic" },
  { name: "Il Palagio", city: "Firenze", address: "Piazza della Madonna degli Aldobrandeschi 10, 50123 Firenze", phone: "+39 055 5383388", website: "https://www.fourseasons.com/florence", cuisine: "Tuscan · hotel dining", owner: "Four Seasons Hotel Firenze", headChef: "Paulo Airaudo", awards: "Michelin-starred · Il Palagio" },
  { name: "Oro Restaurant", city: "Venezia", address: "Riva degli Schiavoni 4196, 30122 Venezia", phone: "+39 041 5235077", website: "https://www.belmond.com/hotels/cipriani-venice", cuisine: "Venetian · refined", owner: "Belmond Hotel Cipriani", headChef: "Davide Bisetto", awards: "Michelin-starred · lagoon views" },
  { name: "Glam Enrico Bartolini", city: "Milano", address: "Via Privata Tommaso Grossi 1, 20121 Milano", phone: "+39 02 62690289", website: "https://www.enricobartolini.it", cuisine: "Italian · contemporary", owner: "Enrico Bartolini", headChef: "Enrico Bartolini", awards: "Michelin-starred · Glam venue" },
  { name: "Enrico Bartolini al Mudec", city: "Milano", address: "Via Tortona 56, 20144 Milano", phone: "+39 02 91322141", website: "https://www.enricobartolini.it", cuisine: "Italian · tasting", owner: "Enrico Bartolini", headChef: "Enrico Bartolini", awards: "3 Michelin stars · flagship at MUDEC" },
  { name: "La Peca", city: "Rocca Grimalda", address: "Via Roma 38, 15078 Rocca Grimalda AL", phone: "+39 0143 878346", website: "https://www.lapeca.it", cuisine: "Piedmont · inn", owner: "Maciocco family", headChef: "Luca Maciocco", awards: "Michelin-starred · Osteria La Peca" },
  { name: "La Siriola", city: "San Cassiano", address: "Strada Micurà de Rü 53, 39036 San Cassiano BZ", phone: "+39 0471 849554", website: "https://www.lasiriola.it", cuisine: "Italian · Alpine", owner: "Hotel Ciasa Salares area", headChef: "Luigi Dariz", awards: "Michelin-starred · Dolomites" },
  { name: "Restaurant Tilia", city: "Sistiana-Visogliano", address: "Sistiana (TS) — fine dining; verify seasonal hours", phone: "+39 040 9190909", website: "https://www.ristorantitrieste.it", cuisine: "Friulian · Karst", owner: "Independent", headChef: "Brigade", awards: "Karst & Trieste dining scene" },
  { name: "Schöneck", city: "Falzes", address: "Via Furcia 15, 39030 Falzes BZ", phone: "+39 0474 653225", website: "https://www.schoeneck.it", cuisine: "Italian · Alpine", owner: "Berger family", headChef: "Karl Baumgartner legacy / brigade", awards: "Michelin-starred · Plan de Corones" },
  { name: "D'O", city: "Cornaredo", address: "Piazza José Clemente Orozco 4, 20072 Cornaredo MI", phone: "+39 02 93606624", website: "https://www.d-o.it", cuisine: "Italian · accessible fine dining", owner: "Davide Oldani", headChef: "Davide Oldani", awards: "Michelin-starred · Pop cuisine" },
  { name: "Abbruzzino", city: "Portocannone", address: "Via Nazionale 89, 86045 Portocannone CB", phone: "+39 0875 704066", website: "https://www.abruzzino.it", cuisine: "Italian · Abruzzo", owner: "Franco Pepe collaboration zone", headChef: "Nicola Fossaceca", awards: "Michelin-starred · Adriatic Abruzzo" },
  { name: "Marzapane", city: "Roma", address: "Via Velletri 39, 00198 Roma", phone: "+39 06 64760729", website: "https://www.marzapaneroma.com", cuisine: "Italian · contemporary", owner: "Isabella Potì & Matteo Barzan", headChef: "Isabella Potì", awards: "Michelin-starred · Rome" },
  { name: "Gagini", city: "Palermo", address: "Via dei Cassari 35, 90133 Palermo", phone: "+39 091 6165277", website: "https://www.gaginipalermo.it", cuisine: "Sicilian · creative", owner: "Independent", headChef: "Filippo La Mantia legacy venue / brigade", awards: "Fine dining · Palermo centro" },
  { name: "Laite", city: "Bressanone", address: "Via Museo 20, 39042 Bressanone BZ", phone: "+39 0472 833833", website: "https://www.laite.it", cuisine: "Italian · Alpine", owner: "Heinzelmann / brigade", headChef: "Alexander Heinzelmann", awards: "Michelin-starred · Südtirol" },
  { name: "Pipero", city: "Roma", address: "Via Monte della Farina 31, 00186 Roma", phone: "+39 06 68139667", website: "https://www.piperoroma.com", cuisine: "Italian · Roman tasting", owner: "Ciro Cristiano", headChef: "Ciro Cristiano", awards: "Michelin-starred · Rome centro" },
  { name: "Acquolina", city: "Roma", address: "Via Antonio Gramsci 68, 00197 Roma", phone: "+39 06 3220814", website: "https://www.acquolina.it", cuisine: "Italian · seafood tasting", owner: "Daniele Lippi", headChef: "Daniele Lippi", awards: "Michelin-starred · Rome" },
  { name: "Orma", city: "Milano", address: "Via Carlo Mirabello 10, 20155 Milano", phone: "+39 02 38231913", website: "https://www.ormamilano.it", cuisine: "Italian · contemporary", owner: "Henrique Fava Junior", headChef: "Henrique Fava Junior", awards: "Michelin-starred · Milan" },
  { name: "Ristorante Berton", city: "Milano", address: "Via Mike Bongiorno 13, 20124 Milano", phone: "+39 02 6707358", website: "https://www.ristoranteberton.com", cuisine: "Italian · refined", owner: "Andrea Berton", headChef: "Andrea Berton", awards: "Michelin-starred · Milan business district" },
  { name: "Al Gatto Verde", city: "Montegrotto Terme", address: "Via Liguria 14, 35036 Montegrotto Terme PD", phone: "+39 049 793477", website: "https://www.alajmo.it/al-gatto-verde", cuisine: "Italian · countryside", owner: "Alajmo family", headChef: "Massimiliano Alajmo", awards: "Michelin-starred · countryside venue" },
  { name: "Il Marin", city: "Genova", address: "Calata Marittima Caricamento 5, 16124 Genova", phone: "+39 010 2475276", website: "https://www.ilmarin.it", cuisine: "Ligurian · seafood", owner: "Porto Antico / Merella", headChef: "Marco Visciola", awards: "Michelin-starred · harbor dining" },
  { name: "Magnolia", city: "Cesenatico", address: "Via Nazario Sauro 81, 47042 Cesenatico FC", phone: "+39 0547 67177", website: "https://www.magnoliacesenatico.it", cuisine: "Romagna · seafood", owner: "Mauro Ricciardi", headChef: "Mauro Ricciardi", awards: "Michelin-starred · Adriatic riviera" },
  { name: "La Credenza", city: "San Maurizio Canavese", address: "Via Medici 2, 10077 San Maurizio Canavese TO", phone: "+39 011 9273898", website: "https://www.lacredenza.it", cuisine: "Piedmont · contemporary", owner: "Igor Macchia", headChef: "Igor Macchia", awards: "Michelin-starred · Turin outskirts" },
  { name: "Ristorante Nostrano", city: "Siracusa", address: "Via Carmelo Campisi 18, 96100 Siracusa", phone: "+39 0931 66202", website: "https://www.ristorantenostrano.com", cuisine: "Sicilian · vegetable-forward", owner: "Corrado Assenza", headChef: "Corrado Assenza", awards: "Michelin Green Star · citrus terroir" },
  { name: "Cannavacciuolo Countryside", city: "Vico Equense", address: "Via Santa Maria Vecchia 2, 80069 Vico Equense NA", phone: "+39 081 802 8656", website: "https://www.cannavacciuolo.it", cuisine: "Neapolitan · countryside", owner: "Antonino Cannavacciuolo", headChef: "Antonino Cannavacciuolo", awards: "Michelin-starred · countryside resort" },
  { name: "Oasis Sapori Antichi", city: "Sant'Arcangelo", address: "Via Nazionale 110, 47841 Sant'Arcangelo RN", phone: "+39 0541 624473", website: "https://www.oasissaporiantichi.it", cuisine: "Romagna · traditional", owner: "Valenti family", headChef: "Valenti brigade", awards: "Notable historic Romagna dining" },
  { name: "Danì Maison", city: "Ischia", address: "Via Montecorvo 69, 80077 Ischia NA", phone: "+39 081 995449", website: "https://www.danimaison.it", cuisine: "Campanian · island", owner: "Danilo Giugni", headChef: "Danilo Giugni", awards: "Michelin-starred · Ischia" },
  { name: "Zia Restaurant", city: "Roma", address: "Via Gorizia 49, 00161 Roma", phone: "+39 06 8414597", website: "https://www.ziarestaurant.it", cuisine: "Italian · Rome Testaccio", owner: "Antonio Ziantoni", headChef: "Antonio Ziantoni", awards: "Michelin-starred · emerging Rome" },
  { name: "Andreina", city: "Loreto", address: "Via Andrea Costa 17, 60017 Loreto AN", phone: "+39 071 975348", website: "https://www.andreina.it", cuisine: "Marche · refined", owner: "Luca Landi", headChef: "Luca Landi", awards: "Michelin-starred · pilgrimage town" },
  { name: "Ristorante Del Cambio", city: "Torino", address: "Piazza Carignano 2, 10123 Torino", phone: "+39 011 546690", website: "https://www.delcambio.it", cuisine: "Piedmont · historic", owner: "Matteo Baronetto", headChef: "Matteo Baronetto", awards: "Michelin-starred · Turin landmark" },
  { name: "Il Porticciolo", city: "Moniga del Garda", address: "Via Porto 36, 25080 Moniga del Garda BS", phone: "+39 0365 503039", website: "https://www.ilporticciolo.net", cuisine: "Lake Garda · seafood", owner: "Lanzani family", headChef: "Brigade", awards: "Michelin-starred · Garda" },
  { name: "Alfredo Russo", city: "Torre Canavese", address: "Via della Maiella 4, 10010 Torre Canavese TO", phone: "+39 0125 529045", website: "https://www.alfredorusso.it", cuisine: "Piedmont · creative", owner: "Alfredo Russo", headChef: "Alfredo Russo", awards: "Michelin-starred · Canavese" },
  { name: "Osteria Arbustico", city: "Montoro", address: "Contrada Casale Caraci 18, 83025 Montoro AV", phone: "+39 0825 526455", website: "https://www.osteriaarbustico.it", cuisine: "Campanian · rural", owner: "Vitale family", headChef: "Pasquale Vitale", awards: "Michelin-starred · Irpinia" },
  { name: "Ristorante Abocar Due Cucine", city: "Rimini", address: "Via Bartolomeo Colleoni 22, 47921 Rimini RN", phone: "+39 0541 604693", website: "https://www.abocar.it", cuisine: "Romagna · dual kitchen", owner: "Luca Marchini", headChef: "Luca Marchini", awards: "Michelin-starred · Rimini" },
];

function buildItaly78(): ItalySeedRow[] {
  return ITALY_78_SOURCE.map((raw, i) => {
    const italyRank = i + 1;
    const citySlug = slugifySegment(raw.city) || "city";
    const baseNameSlug = slugifySegment(raw.name) || "restaurant";
    const nameSlug = `${baseNameSlug}-${italyRank}`;
    return {
      italyRank,
      name: raw.name,
      address: raw.address,
      phone: raw.phone,
      website: raw.website.startsWith("http") ? raw.website : raw.website ? `https://${raw.website}` : "",
      openTableUrl: "",
      cuisine: raw.cuisine,
      city: raw.city,
      county: "",
      citySlug,
      countySlug: ITALY_LIST_COUNTY_SLUG,
      nameSlug,
      owner: raw.owner,
      headChef: raw.headChef,
      awards: raw.awards,
      thumbnailUrl: "",
      country: "Italy",
    };
  });
}

export const ITALY_78_SEED = buildItaly78();

/** Stable editorial sequence for the Top Restaurants “Italy” filter (matches `ITALY_78_SOURCE` / your ranked list). */
export const ITALY_EDITORIAL_ORDER_INDEX: Record<string, number> = Object.fromEntries(
  ITALY_78_SEED.map((r, i) => [r.name, i]),
);
