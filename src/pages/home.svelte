<script>
  import {
    Page,
    Navbar,
    Block,
    Range,
    BlockTitle,
    Button,
    f7,
    Input,
    Icon,
    NavTitleLarge,
    List,
    ListInput,
    LoginScreen,
    LoginScreenTitle,
    ListButton,
    BlockFooter,
  } from "framework7-svelte";
  import { onMount } from "svelte";
  import { Client } from "@gradio/client";
  import { writable } from "svelte/store";

  let pickerDevice,
    soiltypepicker,
    fallowperiod = 6,
    farmsize,
    loading = false,
    result = false;

  let response;

  let pickerDependent;
  const carVendors = {
    Red: [
      "Tomato",
      "Sweetcorn",
      "Cabbage",
      "Groundnut",
      "Potato",
      "Paddy",
      "Banana",
      "Mulberry",
      "Maize",
      "Beans",
      "Papaya",
      "Sweetcorn",
      "Mango",
    ],
    Black: [
      "Tomato",
      "Mulberry",
      "Potato",
      "Groundnut",
      "Sweetcorn",
      "Chilies",
      "Horsegram",
      "Beans",
    ],
    "Rock Soil": ["Flowers", "Groundnut", "Jowar"],
    "Black Sandy": ["Groundnut"],
    Sandy: ["Groundnut"],
    "Sandy Red": ["Horse gram", "Groundnut"],
  };

  let crop, soil;

  onMount(() => {
    pickerDependent = f7.picker.create({
      inputEl: "#demo-picker-dependent",
      rotateEffect: true,
      formatValue(values) {
        crop = values[1];
        soil = values[0];
        return `${values[0]} Soil: ${values[1]}`;
      },
      cols: [
        {
          textAlign: "left",
          values: ["Red", "Black", "Sandy Red", "Sandy", "Black Sandy"],
          onChange(picker, country) {
            if (picker.cols[1].replaceValues) {
              picker.cols[1].replaceValues(carVendors[country]);
            }
          },
        },
        {
          values: carVendors.Red,
          width: 160,
        },
      ],
    });
  });

  let fertilizer_amount = [];

  import { FirebaseFirestore } from "@capacitor-firebase/firestore";

  async function submitData() {
    loading = true;
    let data = {
      soil_type_input: soil,
      crop_type_input: crop,
      land_size_m2: Math.floor(farmsize),
      fallow_years: Math.floor(fallowperiod) / 12,
    };
    console.log(data);

    if (!crop || !soil || !farmsize || fallowperiod === "") {
      f7.dialog.alert("All fields are required");
      loading = false;
      return;
    }

    const client = await Client.connect("isitraghav/farmingandall");
    const results = await client.predict("/predict", data);

    response = results.data;
    console.log(response);

    if (response) {
      Object.entries(response[0].fertilizer_amounts).forEach((ent) => {
        fertilizer_amount = [
          ...fertilizer_amount,
          { name: ent[0], amount: ent[1] },
        ];
      });
      await axios.get("https://ipapi.co/json/").then(async (res) => {
        console.log(res.data.latitude, res.data.longitude);

        await FirebaseFirestore.addDocument({
          reference:
            "users/" + res.data.latitude + "&" + res.data.longitude + "/data",
          data: { data: data, res: response, geo: res.data },
        });
      });
    }
    result = true;
    loading = false;
  }
  let loginScreenOpened = true;

  import Speedometer from "svelte-speedometer";
  let phSoilData = {
    Red: 6.5,
    Black: 7.0,
    "Sandy Red": 6.0,
    Sandy: 6.8,
    "Black Sandy": 7.2,
  };

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import axios from "axios";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCLKBJYg_K1O1TMf_qjF-7PQWDDAZfNE_8",
    authDomain: "farmingapp-hackathon.firebaseapp.com",
    projectId: "farmingapp-hackathon",
    storageBucket: "farmingapp-hackathon.appspot.com",
    messagingSenderId: "709169373788",
    appId: "1:709169373788:web:94255a1ab1e66f70283c99",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>

<Page name="home">
  <Navbar
    large
    backLink={result}
    onClickBack={() => {
      location.reload();
    }}
  >
    <NavTitleLarge>KrishiMitra</NavTitleLarge>
  </Navbar>
  {#if !loading}
    {#if result}
      <Block strongIos outlineIos inset>
        <BlockTitle>Fertilizer Recommendation</BlockTitle>

        {#if response[0].error}
          err
        {:else}
          <div class="text-lg text-center font-bold">
            {new String(response[0].recommendation)}
          </div>
          <br />
          <p class="text-lg font-semibold">
            Soil Type: {soil}
          </p>
          <p class="text-lg font-semibold">
            Crop Type: {crop}
          </p>
          <br />
          <ul class="list-disc pl-4">
            {#each fertilizer_amount as f}
              <li class="text-lg font-semibold">{f.name}: {f.amount} kg</li>
            {/each}
          </ul>
          <p class="text-lg font-semibold">
            For {farmsize}m<sup>2</sup> area which was left fallow for {fallowperiod}
            months
          </p>
        {/if}
      </Block>
      <div class="flex justify-center items-center flex-col">
        <div class="text-lg ml-3 mt-3">{soil} Soil pH Level</div>
        <Speedometer
          needleHeightRatio={0.7}
          segments={14}
          maxValue={14}
          value={phSoilData[soil]}
          needleColor="steelblue"
          needleTransitionDuration={4000}
          needleTransition="easeElastic"
          textColor="black"
        />
      </div>
    {:else}
      <Block strongIos outlineIos inset>
        <Input
          type="text"
          placeholder="Select Crop"
          inputId="demo-picker-dependent"
        />
      </Block>
      <!-- <Block strongIos outlineIos inset>
        <BlockTitle>Select Crop</BlockTitle>
        <div class="m-2 text-lg">
          <Input type="text" placeholder="Paddy" inputId="demo-picker-device" />
        </div>
      </Block>

      <Block strongIos outlineIos inset>
        <BlockTitle>Soil type</BlockTitle>
        <div class="m-2 text-lg">
          <Input type="text" placeholder="Red" inputId="soiltypepicker" />
        </div>
      </Block> -->

      <Block strongIos outlineIos inset>
        <BlockTitle>Farm Size (m<sup>2</sup>)</BlockTitle>
        <div class="flex">
          <Input bind:value={farmsize} type="number" placeholder="200"></Input>
        </div>
      </Block>
      <Block strongIos inset outlineIos>
        <BlockTitle>Fallow Period</BlockTitle>
        <Range
          min={0}
          max={50}
          label={true}
          step={1}
          bind:value={fallowperiod}
          scale={true}
          scaleSteps={5}
          scaleSubSteps={5}
        />
        <br />
        {#if fallowperiod > 11}
          {Math.floor(fallowperiod / 12)} year{fallowperiod < 24 ? "" : "s"}
          {fallowperiod % 12} months
        {:else}
          {fallowperiod} months
        {/if}
      </Block>

      <Block>
        <Button
          on:click={submitData}
          fill
          round
          color="blue"
          style="margin-top: 10px;">Submit</Button
        >
      </Block>
    {/if}
  {:else if loading}
    <p class="flex justify-center animate-spin mt-3">
      <Icon f7="rays" />
    </p>
    <div class="flex justify-center">
      <p>{["Calculating...", "Checking data...", "Loading..."][Math.floor(Date.now() / 1000) % 3]}</p>
    </div>
  {/if}
</Page>
