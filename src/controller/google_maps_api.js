const { Client } = require("@googlemaps/google-maps-services-js");
const { default: axios } = require("axios");

const response = require("../lib/response");
const direction_route = require("../middleware/direction_route");

const googleMapClient = new Client();
class GoogleAPIs {
  static directionAPI(req, res) {
    googleMapClient
      .directions({
        params: {
          key: process.env.GOOGLE_MAPS_API_KEY,
          origin: {
            latitude: req.body["latOrigin"],
            longitude: req.body["lngOrigin"],
          },
          destination: {
            latitude: req.body["latDestination"],
            longitude: req.body["lngDestination"],
          },
        },
      })
      .then((gres) => {
        return response(res, true, "Succeed", gres.data, 200);
      })
      .catch((err) => {
        res.json({ err: err.message });
      });
  }
  static async testRenpam(req, res) {
    try {
      const coordinate = [
        {
          options: {},
          latLng: { lat: -8.145423076153314, lng: 114.5802625899731 },
          name: "Jalan Melati, Pahlengkong, Buleleng, Provinsi Bali, 81155, Indonesia",
          _initHooksCalled: true,
        },
        {
          options: {},
          latLng: { lat: -8.145423076153314, lng: 114.6096588840146 },
          name: "Sumberkima, Buleleng, Provinsi Bali, 81155, Indonesia",
          _initHooksCalled: true,
        },
      ];
      // let coordinateString = "";
      // coordinate.forEach((coordinateData, index) => {
      //   coordinateString +=
      //     coordinateData.latLng.lng + "," + coordinateData.latLng.lat;
      //   coordinateString += index != coordinate.length - 1 ? ";" : "";
      // });

      // let data = await axios({
      //   url:
      //     "https://router.project-osrm.org/route/v1/car/" +
      //     coordinateString +
      //     "?overview=simplified&geometries=geojson&alternatives=3&steps=true",
      // });
      // let directions = [];
      // let getDataRoutes = data.data.routes[0].legs;
      // getDataRoutes.forEach((leg) => {
      //   leg.steps.forEach((step, j) => {
      //     step.geometry.coordinates.forEach((intersection, k) => {
      //       directions.push({
      //         latitude: intersection[1],
      //         longitude: intersection[0],
      //       });
      //     });
      //   });
      // });
      let directions = await direction_route(coordinate);
      return response(res, true, "Berhasil", directions, 200);
    } catch (error) {
      return res.json({
        error: error.message,
      });
    }
  }
  static async directionAPICostumize(req, res) {
    try {
      const { coordinate, alternatif1, alternatif2 } = req.query;
      if (!coordinate) {
        return response(res, false, "coordinate Tidak boleh kosong", [], 400);
      }
      let dataCoordinate = "";
      let dataCoordinateAlter2 = "";
      let dataCoordinateAlter1 = "";
      let responseAlter1 = {};
      let responseAlter2 = {};

      coordinate.forEach((coordinateData, index) => {
        dataCoordinate += coordinateData;
        dataCoordinate += index != coordinate.length - 1 ? ";" : "";
      });

      if (alternatif1) {
        alternatif1.forEach((coordinateData, index) => {
          dataCoordinateAlter1 += coordinateData;
          dataCoordinateAlter1 += index != alternatif1.length - 1 ? ";" : "";
        });
      }

      if (alternatif2) {
        alternatif2.forEach((coordinateData, index) => {
          dataCoordinateAlter2 += coordinateData;
          dataCoordinateAlter2 += index != alternatif2.length - 1 ? ";" : "";
        });
      }

      let data = await axios({
        url:
          "https://router.project-osrm.org/route/v1/car/" +
          dataCoordinate +
          "?overview=simplified&geometries=geojson&alternatives=3&steps=true",
      });

      if (dataCoordinateAlter1 != "") {
        responseAlter1 = await axios({
          url:
            "https://router.project-osrm.org/route/v1/car/" +
            dataCoordinateAlter1 +
            "?overview=simplified&geometries=geojson&alternatives=3&steps=true",
        });
      }
      if (dataCoordinateAlter2 != "") {
        responseAlter2 = await axios({
          url:
            "https://router.project-osrm.org/route/v1/car/" +
            dataCoordinateAlter2 +
            "?overview=simplified&geometries=geojson&alternatives=3&steps=true",
        });
      }

      let directions = [];
      let directionsAlter1 = [];
      let directionsAlter2 = [];

      let getDataRoutes = data.data.routes[0].legs;
      let getDataRoutesAlter1 = responseAlter1?.data?.routes[0]?.legs;
      let getDataRoutesAlter2 = responseAlter2?.data?.routes[0]?.legs;
      getDataRoutes.forEach((leg) => {
        leg.steps.forEach((step, j) => {
          step.geometry.coordinates.forEach((intersection, k) => {
            directions.push({
              latitude: intersection[1],
              longitude: intersection[0],
            });
          });
        });
      });
      getDataRoutesAlter1?.forEach((leg) => {
        leg?.steps.forEach((step, j) => {
          step?.geometry?.coordinates?.forEach((intersection, k) => {
            directionsAlter1.push({
              latitude: intersection[1],
              longitude: intersection[0],
            });
          });
        });
      });
      getDataRoutesAlter2?.forEach((leg) => {
        leg?.steps.forEach((step, j) => {
          step?.geometry?.coordinates?.forEach((intersection, k) => {
            directionsAlter2.push({
              latitude: intersection[1],
              longitude: intersection[0],
            });
          });
        });
      });

      return response(
        res,
        false,
        "Succ",
        {
          route: directions.reverse(),
          distanceKmRoute:
            (data.data.routes[0].distance / 1000).toFixed(2) + " Km",
          durationRoute:
            (data.data.routes[0].duration / 60).toFixed(2) + " Menit",
          distanceKmRouteAlter1: responseAlter1?.data?.routes[0].distance
            ? (responseAlter1?.data?.routes[0].distance / 1000).toFixed(2) +
              " Km"
            : "0 Km",
          durationRouteAlter1: responseAlter1?.data?.routes[0].duration
            ? (responseAlter1?.data?.routes[0].duration / 60).toFixed(2) +
              " Menit"
            : "0 Menit",
          distanceKmRouteAlter2: responseAlter2?.data?.routes[0].distance
            ? (responseAlter2?.data?.routes[0].distance / 1000).toFixed(2) +
              " Km"
            : "0 Km",
          durationRouteAlter2: responseAlter2?.data?.routes[0].duration
            ? (responseAlter2?.data?.routes[0].duration / 60).toFixed(2) +
              " Menit"
            : "0 Menit",
          alternatif1: directionsAlter1.reverse(),
          alternatif2: directionsAlter2.reverse(),
          data: data.data,
        },
        200
      );
    } catch (error) {
      // console.log({ error });
      // return response(res, true, "success", data, 200);
      res.json({ err: error.message });
    }
  }
  static async directionAPIfromOSRM(req, res) {
    try {
      const place = await googleMapClient.placeDetails({
        params: {
          place_id: req.query.place_id,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });
      return response(
        res,
        true,
        "success",
        {
          detail_alamat: place.data.result.formatted_address,
          name_place: place.data.result.name,
          photos: {
            referece: place.data.result?.photos[0]?.photo_reference,
            height: place.data.result?.photos[0]?.height,
            width: place.data.result?.photos[0]?.width,
          },
          coordinate: place.data.result.geometry.location,
        },
        200
      );
    } catch (error) {
      console.log({ error });
      return res.json({
        error: error.message,
      });
      // return response(res, false, error.message, error, 500);
    }
  }
  static reverseGeocodingAPI(req, res) {
    googleMapClient
      .reverseGeocode({
        params: {
          key: process.env.GOOGLE_MAPS_API_KEY,
          latlng: {
            latitude: req.body["lat"],
            longitude: req.body["lng"],
          },
          result_type: [
            "administrative_area_level_1",
            "administrative_area_level_2",
            "administrative_area_level_3",
            "administrative_area_level_4",
            "administrative_area_level_5",
            "administrative_area_level_6",
            "administrative_area_level_7",
          ],
          language: "id",
        },
      })
      .then((resGeocode) => {
        const result = resGeocode.data.results,
          compondeCode = resGeocode.data.plus_code.compound_code;
        let data = null,
          txtAddress = null;
        if (result.length > 0 && result[0].address_components.length > 0) {
          data = {
            country: null,
            province: null,
            district: null,
            subdistrict: null,
            village: null,
            citizen_assosiation: null,
            neighborhood_association: null,
          };
          txtAddress = result[0].formatted_address;
          Object.keys(data).forEach((k, i) => {
            if (i < result[0].address_components.length) {
              data[k] =
                result[0].address_components[
                  result[0].address_components.length - (i + 1)
                ]?.long_name;
            }
          });
        }
        return response(
          res,
          true,
          txtAddress ?? compondeCode,
          data ?? resGeocode.data.results,
          200
        );
      })
      .catch((err) => response(res, false, err.message, err, 500));
  }
  static nearByPlacesGoogle(req, res) {
    const { type, radius, coordinate } = req.query;
    googleMapClient
      .placesNearby({
        params: {
          key: process.env.GOOGLE_MAPS_API_KEY,
          radius: radius,
          type: type,
          location: coordinate,
        },
      })
      .then(({ data }) => {
        return response(res, true, "success", data, 200);
      });
  }
  static placePhotoGoogle(req, res) {
    try {
      const { photo_reference } = req.query;
      googleMapClient
        .placePhoto({
          params: {
            photoreference: photo_reference,
            maxwidth: 500,
            // client_id: '',
            // client_secret: '',

            key: process.env.GOOGLE_MAPS_API_KEY,
            // radius: radius,
            // type: type,
            // location: coordinate,
          },
        })
        .then(({ data }) => {
          return response(res, true, "success", data, 200);
        })
        .catch((err) => {
          response(res, false, err.message, err, 500);
        });
    } catch (err) {
      response(res, false, err.message, err, 500);
    }
  }
  static testApi = async (req, res) => {
    try {
      // https://irsms.korlantas.polri.go.id/irsmsapi/api/bagops
      const getData = await axios({
        url: `https://irsms.korlantas.polri.go.id/irsmsapi/api/bagops`,
      });
      response(res, true, "Berhasil", getData.data, 200);
    } catch (error) {
      response(res, false, error.message, error, 400);
    }
  };
}

module.exports = GoogleAPIs;
