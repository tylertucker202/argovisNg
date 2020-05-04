
import 'leaflet'
import 'proj4leaflet'
import 'leaflet-graticule'
declare const L;
  
  export const sStereo = new L.Proj.CRS('EPSG:3411',
                                  '+proj=stere '+
                                  '+lat_0=-90 +lon_0=-45 +lat_ts=80'+
                                  '+k=1 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs',
                                  {
                                      resolutions: [
                                      4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8
                                      ],
                                      origin: [.1,.1]
                                  });
  export const nStereo = new L.Proj.CRS('EPSG:3411',
                                  '+proj=stere' +
                                  '+lat_0=90 +lon_0=-45 +lat_ts=-80' +
                                  ' +k=1 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs',
                                  {
                                      resolutions: [
                                      4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8
                                      ],
                                      origin: [.1,.1]
                                  });
  export const worldStyle = {
    "color": "#15b01a",
    "fill-rule": "evenodd",
    "weight": 1,
    "fillColor": "#033500",
    "opacity": 1,
    "fillOpacity": .9,
    };

  export const satelliteMap = new L.TileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  });
  export const googleMap = new L.TileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
    {attribution: 'google'
  });
  export const esri_OceanBasemap = new L.TileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
    {attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
  });

  export const gebco = new L.TileLayer.WMS('https://www.gebco.net/data_and_products/gebco_web_services/2019/mapserv?', {
    layers: 'GEBCO_2019_GRID',
    attribution: 'WMS for the GEBCO_2019 global bathymetric grid'
    });

  export const gebco_2 = new L.TileLayer.WMS('https://www.gebco.net/data_and_products/gebco_web_services/2019/mapserv?', {
    layers: 'GEBCO_2019_GRID_2',
    attribution: 'WMS for the GEBCO_2019 global bathymetric grid. This layers displays the GEBCO_2019 Grid as an image colour-shaded for elevation'
    });

  export const Hydda_Base = new L.TileLayer('https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png', {
    attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  export const Stamen_TonerLite = new L.TileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  });

  export const Stamen_TonerBackground = new L.TileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  });

  export const Esri_WorldGrayCanvas = new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
  });

  export const CartoDB_Positron = new L.TileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  });

  export const graticuleDark = L.latlngGraticule({
  showLabel: true,
  color: '#000000',
  opacity: .5,
  zoomInterval: [
    {start: 0, end: 4, interval: 30},
    {start: 4, end: 5, interval: 10},
    {start: 5, end: 7.5, interval: 5},
    {start: 7.5, end: 12, interval: 1}
    ]
  });
  
  export const graticuleLight = L.latlngGraticule({
    showLabel: true,
    color: '#aaa',
    opacity: 1,
    zoomInterval: [
      {start: 0, end: 4, interval: 30},
      {start: 4, end: 5, interval: 10},
      {start: 5, end: 7.5, interval: 5},
      {start: 7.5, end: 12, interval: 1}
      ]
  });

  export const curvedGraticule = L.latlngGraticule({
    showLabel: true,
    latLineCurved: 1,
    weight: 3,
    lngLineCurved: 1,
    zoomInterval: [
      {start: 0, end: 4, interval: 30},
      {start: 4, end: 5, interval: 10},
      {start: 5, end: 7.5, interval: 5},
      {start: 7.5, end: 13, interval: 1}
      ]
    });