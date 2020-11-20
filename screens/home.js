import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import Container from "./container";
import * as Location from "expo-location";
import axios from "axios";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import * as SplashScreen from "expo-splash-screen";

const Home = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [weatherResponse, setWeatherResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  React.useLayoutEffect(() => {
    if (errorMsg !== null)
      navigation.setOptions({
        headerShown: false,
      });
  }, [errorMsg]);

  //only run when component mounts
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    getCurrentLocation();
  }, []);

  //executes everytime the location changes
  useEffect(() => {
    if (location) {
      getWeatherInfo();
    }
  }, [location]);

  useEffect(() => {
    if (route.params?.locationDetail) {
      let { lat, lon, city } = route.params.locationDetail;
      setLocation({ lon, lat, city });
    }
  }, [route.params?.locationDetail]);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg({
        text: "Permission to access location was denied",
        description: `Please grant the permission by going in "Settings -> Privacy -> Location Services and retry".`,
      });
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const place = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    setLocation({
      lon: location.coords.longitude,
      lat: location.coords.latitude,
      city: place[0].city,
    });
  };

  const getDate = () => {
    let unixTs = weatherResponse.current.dt;
    return moment.unix(unixTs).format("ddd, MMMM D");
  };

  const getHours = (unix) => {
    return moment.unix(unix).format("h A");
  };

  const getDay = (unix) => {
    return moment.unix(unix).format("ddd");
  };

  const getWeatherInfo = async () => {
    console.log("got here");
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lon}&units=imperial&appid=f68a2c64528807e012d6fe72a8755f7e`;
    axios
      .get(url)
      .then((res) => {
        setWeatherResponse(res.data);
      })
      .catch((error) => {
        setErrorMsg({
          text: "Uh oh",
          description:
            "Something went wrong. Please come back later and try again.",
        });
      });
  };

  return (
    <Container>
      <StatusBar style="light" />
      {!!weatherResponse && SplashScreen.hideAsync() && (
        <View style={styles.container}>
          {/* ------------------------------------------------------------------------------------------------------------------- */}
          <View style={styles.headerLocation}>
            <View style={styles.innerHeaderLocation}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color="white"
                style={styles.markerIcon}
              />
              <Text style={styles.textTitle}>{location.city}</Text>
            </View>
            <View style={styles.innerHeaderMargin}>
              <Text style={styles.textDate}>{getDate()}</Text>
            </View>
            <View style={styles.innnerTemperature}>
              <Image
                style={styles.mainImage}
                source={{
                  uri: `http://openweathermap.org/img/wn/${weatherResponse.current.weather[0].icon}@4x.png`,
                }}
              />
              <Text style={styles.mainTemp}>
                {Math.round(weatherResponse.current.temp)}&#176;
              </Text>
            </View>
            <View
              style={{
                paddingLeft: 6,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                // alignItems: "center"
              }}
            >
              <Text style={styles.descriptionText}>
                {weatherResponse.current.weather[0].description}
              </Text>
              <Ionicons
                name="ios-refresh"
                size={18}
                color="white"
                style={{ marginTop: -10, marginLeft: 8 }}
                onPress={() => getWeatherInfo()}
              />
            </View>
          </View>
          {/* ------------------------------------------------------------------------------------------------------------------- */}
          <View style={styles.currentWeatherDetail}>
            <View>
              <Ionicons
                style={styles.currentWeatherDetailIcon}
                name="ios-thermometer"
                size={30}
                color="white"
              />
              <Text style={styles.currentWeatherDetailText}>Feels like</Text>
              <Text style={styles.currentWeatherDetailText}>
                {Math.round(weatherResponse.current.feels_like)}
                &#176;
              </Text>
            </View>
            <View style={styles.divider}></View>
            <View>
              <MaterialCommunityIcons
                name="weather-windy"
                size={30}
                color="white"
                style={styles.currentWeatherDetailIcon}
              />
              <Text style={styles.currentWeatherDetailText}>Wind</Text>
              <Text style={styles.currentWeatherDetailText}>
                {Math.round(weatherResponse.current.wind_speed)} mph
              </Text>
            </View>
            <View style={styles.divider}></View>
            <View>
              <Ionicons
                style={styles.currentWeatherDetailIcon}
                name="ios-water"
                size={30}
                color="white"
              />
              <Text style={styles.currentWeatherDetailText}>Humidity</Text>
              <Text style={styles.currentWeatherDetailText}>
                {Math.round(weatherResponse.current.humidity)} %
              </Text>
            </View>
          </View>
          {/* ------------------------------------------------------------------------------------------------------------------- */}
          <View style={styles.hourlyWeather}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 25,
              }}
            >
              <Text style={styles.hoursText}>HOURLY</Text>
              <View style={styles.HourlyDividerText}></View>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              decelerationRate="fast"
            >
              {weatherResponse.hourly.map((item, index) => {
                return (
                  <View
                    key={item.dt}
                    style={{
                      padding: 25,
                      height: 100,
                      width: 100,
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={styles.hourlyTime}>{getHours(item.dt)}</Text>
                    <Image
                      style={styles.smallImage}
                      source={{
                        uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`,
                      }}
                    />
                    <Text style={styles.hourlyTemp}>
                      {Math.round(item.temp)}
                      &#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          {/* ------------------------------------------------------------------------------------------------------------------- */}
          <View styles={styles.dailyWeather}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 20,
              }}
            >
              <Text style={styles.sevenDaysText}>NEXT 7 DAYS</Text>
              <View style={styles.dailyDividerText}></View>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              decelerationRate="fast"
            >
              {weatherResponse.daily.map((item, index) => {
                return (
                  <View
                    key={item.dt}
                    style={{
                      padding: 5,
                      height: 150,
                      width: 100,
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "column",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={styles.dailyDay}>{getDay(item.dt)}</Text>
                    <Text style={styles.dailyPop}>
                      {(item.pop * 100).toFixed()}%
                    </Text>
                    <Image
                      style={styles.smallImage}
                      source={{
                        uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`,
                      }}
                    />
                    <Text style={styles.dailyHigh}>
                      {Math.round(item.temp.max)}&#176;
                    </Text>
                    <View style={styles.dailyUnderscore}></View>
                    <Text style={styles.dailyLow}>
                      {Math.round(item.temp.min)}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          {/* ------------------------------------------------------------------------------------------------------------------- */}
        </View>
      )}
      {!!errorMsg && SplashScreen.hideAsync() && (
        <View style={styles.errorContainer}>
          <Ionicons
            style={styles.currentWeatherDetailIcon}
            name="ios-warning"
            size={120}
            color="orange"
          />
          <Text style={styles.errorText}>{errorMsg.text}</Text>
          <Text style={styles.erroDescription}>{errorMsg.description}</Text>
        </View>
      )}
    </Container>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    color: "#fff",
    justifyContent: "flex-start",
    marginVertical: 60,
    flexDirection: "column",
    display: "flex",
  },
  headerLocation: {
    display: "flex",
    flexDirection: "column",
    color: "white",
    textAlign: "center",
    alignItems: "center",
    marginVertical: 10,
    paddingBottom: 55,
  },
  innerHeaderLocation: {
    flexDirection: "row",
    margin: 3,
  },
  innerHeaderMargin: {
    margin: 1,
  },
  currentWeatherDetail: {
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    width: "100%",
  },
  hourlyWeather: {
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
    marginTop: 40,
    borderRadius: 10,
    width: "100%",
  },
  dailyWeather: {
    flex: 2,
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
  },
  innnerTemperature: {
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
  },
  mainImage: {
    width: 110,
    height: 110,
    left: 5,
  },
  smallImage: {
    width: 60,
    height: 60,
  },
  mainTemp: {
    fontSize: 55,
    color: "#fff",
    fontWeight: "300",
    right: 5,
  },
  markerIcon: {},

  textTitle: {
    color: "#fff",
    fontWeight: "700",
  },
  currentWeatherDetailText: {
    color: "#fff",
    fontWeight: "300",
    fontSize: 16,
    alignSelf: "center",
    marginTop: 5,
  },
  currentWeatherDetailIcon: {
    alignSelf: "center",
  },
  divider: {
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255, 255, 255, 0.3)",
    height: 100,
  },
  dailyDividerText: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    width: 280,
  },
  sevenDaysText: {
    color: "#fff",
    fontWeight: "400",
    marginHorizontal: 10,
  },
  HourlyDividerText: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    width: 310,
  },
  hoursText: {
    color: "#fff",
    fontWeight: "400",
    marginHorizontal: 10,
  },
  hourlyTime: {
    color: "#fff",
    fontWeight: "300",
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 10,
  },
  hourlyTemp: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    alignSelf: "center",
    textAlign: "center",
    marginTop: 14,
  },
  descriptionText: {
    color: "#fff",
    fontWeight: "500",
    textTransform: "capitalize",
    fontSize: 17,
    marginTop: -10,
  },
  textDate: {
    color: "#fff",
    fontWeight: "300",
    fontSize: 12,
    paddingLeft: 12,
  },
  dailyDay: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 8,
  },
  dailyPop: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 14,
    alignSelf: "center",
    marginBottom: -5,
  },
  dailyHigh: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    alignSelf: "center",
    marginVertical: -5,
    marginBottom: 3,
  },
  dailyLow: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 5,
    marginTop: 3,
  },
  dailyUnderscore: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.9)",
    width: 25,
  },
  errorContainer: {
    alignItems: "center",
    color: "#fff",
    justifyContent: "center",
    marginVertical: 60,
    marginHorizontal: 5,
    flexDirection: "column",
    display: "flex",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 15,
    marginTop: 250,
  },
  errorText: {
    marginTop: 20,
    color: "#fff",
    fontSize: 22,
    fontWeight: "500",
    lineHeight: 25,
    textAlign: "center",
  },
  erroDescription: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 25,
    textAlign: "center",
  },
});
