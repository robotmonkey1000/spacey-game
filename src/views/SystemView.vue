<script setup>
import CheckLogin from '../components/checkLogin.vue';
import Trait from '../components/TraitComp.vue';
import Waypoint from '../components/Location/WaypointComp.vue'
import router from '../router'
import axios from 'axios';
import {ref, onBeforeUnmount, watch} from 'vue';

import p5 from 'p5';

import { storeToRefs } from 'pinia';
import { useLoginStore } from '@/stores/loginToken';

const props = defineProps(['sid', 'wid']);

const store = useLoginStore();
const {token} = storeToRefs(store);

const system = ref("");
const errorMessage = ref("");

const axiosConfig = {
    headers: {
        Authorization: "Bearer " + token.value
    }
}

const systemRef = ref(null);
const organizedSystem = ref(null);

function submitSystem() {
    if(system.value !== "")
    {
        errorMessage.value = "";
        GetSystemInfo();
    }
    else
    {
        errorMessage.value = "Invalid System!";
    }
}

function OrganizeSystem() {
    organizedSystem.value = {};
    for(let body of systemRef.value)
    {
        if(!body.orbits)
        {
            organizedSystem.value[body.symbol] = body;
            body.orbitals = {};
        }
        else 
        {
            organizedSystem.value[body.orbits].orbitals[body.symbol] = body;
        }
    }
    
    console.log(organizedSystem.value);
}


const mouseX = ref(0);
const mouseY = ref(0);

function GetSystemInfo() {
    const splitPoint = system.value.split('-');
    console.log(splitPoint);
    if(splitPoint.length == 2)
    {
        errorMessage.value = "";
        
        const symbol = splitPoint[0] + '-' + splitPoint[1];
        const url = 'https://api.spacetraders.io/v2/systems/' + symbol + '/waypoints/';
        axios.get(url,  axiosConfig)
        .then(function (response) {
            console.log(response);
                systemRef.value = response.data.data;
                console.log(systemRef.value);
                OrganizeSystem();
                RenderSystem();

                if(props.wid) 
                {
                    for(let body of systemRef.value)
                    {
                        if(body.symbol == props.wid)
                        {
                            selectedBody.value = body;
                        }
                    }
                }
                
            })
            .catch(function (error) {
                console.log(error);
                errorMessage.value = error.response.data.error.message;
            });
    }
    else
    {
        errorMessage.value = "Invalid System!";
    }
    
    
}

const selectedBody = ref(null);


function LoadSystem() {
    console.log("Loading!");
    if(token.value != null && props.sid) {
        system.value = props.sid;

        GetSystemInfo();
    }
}

LoadSystem();

watch(props, LoadSystem);

const myP5 = ref(null);


function RenderSystem() 
{
    
    if(myP5.value != null)
        myP5.value.remove();

    let sketch = function(p) 
    {
        let size = 600;
        let scale = 4;

        let circleDiameter = 3;
        p.setup = function() {
            p.createCanvas(size, size);
        };

        p.draw = function() 
        {

            
            p.clear();
            p.background(0, 0, 0, 150);

            p.drawingContext.setLineDash([6,5])
            p.line(0, size/2, size, size/2);

            p.line(size/2, 0, size/2, size);
            
            mouseX.value = Math.round((p.mouseX - size/2) / scale);
            mouseY.value = Math.round((p.mouseY - size/2) / scale);
            
            if(systemRef.value != null) 
            {
                // console.log('test');
                
                p.translate(size / (2), size/ (2));

                
                p.fill(255);
                p.scale(scale);                
                for(let thing in organizedSystem.value) 
                {
                    let body = organizedSystem.value[thing];
                    if(selectedBody.value != null && body.symbol == selectedBody.value.symbol)
                    {
                        p.fill(0, 255, 255);
                    }
                    else
                    {
                        p.fill(255);
                    }

                    p.noStroke();
                    p.circle(body.x, body.y, circleDiameter);

                    let orbitalCount = 0;
                    let orbitalDist = 3;
                    for(let orbID in body.orbitals)
                    {
                        let orbital = body.orbitals[orbID];
                        if(selectedBody.value != null && orbital.symbol == selectedBody.value.symbol)
                        {
                            p.fill(0, 255, 255);
                        }
                        else
                        {
                            p.fill(255);
                        }
                        let x = p.sin(orbitalCount * 45) * orbitalDist;
                        let y = p.cos(orbitalCount * 45) * orbitalDist;

                        orbital.adjustedX = Math.round(orbital.x + x);
                        orbital.adjustedY = Math.round(orbital.y + y);
                        orbitalCount++;
                        
                        // console.log(orbital);
                        p.circle(orbital.adjustedX, orbital.adjustedY, circleDiameter / 2);
                    }
                }


                for(let thing in organizedSystem.value)
                {
                    
                    let body = organizedSystem.value[thing];
                    p.fill(255);
                    p.textSize(2);
                    p.strokeWeight(0.8);
                    p.stroke(0);
                    p.text(body.symbol, body.x - 3, body.y - 3);
                }


            }
        };

        p.mouseClicked = () =>
        {
            //TODO check which planet this landed on.
            for(let id in organizedSystem.value)
            {
                const body = organizedSystem.value[id];
                for(let orbID in body.orbitals)
                {
                    let orbital = body.orbitals[orbID];
                    if(p.dist(orbital.adjustedX, orbital.adjustedY, mouseX.value, mouseY.value) <= (circleDiameter / 2 ) / 2)
                    {
                        selectedBody.value = orbital; //We have selected an orbital
                        GoToBody();
                        return;
                    }
                }

                if(p.dist(body.x, body.y, mouseX.value, mouseY.value) <= circleDiameter / 2)
                {
                    selectedBody.value = body; //We have selected an regular body
                    GoToBody();
                    return;
                }
            }
        }
    };


    myP5.value = new p5(sketch, 'canvasArea');
}

function GoToBody() 
{
    let split = selectedBody.value.symbol.split('-');
    let systemId = split[0] + '-' + split[1];
    router.push({name:"detailedwaypoint", params:{sid:systemId, wid:selectedBody.value.symbol}});
}

onBeforeUnmount(() => {
    if(myP5.value != null)
        myP5.value.remove();
})


function GoToShipyard() {
    router.push({name:"shipyard", params:{id:selectedBody.value.symbol}});
}

function GoToMarket() {
    router.push({name:"marketplace", params:{id:selectedBody.value.symbol}});
}

</script>



<template>
  <main>
    <CheckLogin></CheckLogin>
    <div class="section">
        <div class="searchContainer">
            <h1>System Info</h1>

            <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>
            <div class="searchForm">
                <input v-model="system" placeholder="system">
                <button @click="submitSystem">SEARCH</button>
            </div>

        </div>

        <div id="systemDrawing">
            <div>
                <h2 class="fade-animation" v-if="systemRef && !selectedBody">Select Planet</h2>   
                <!-- <p  v-if="systemRef">{{ mouseX }}, {{ mouseY }}</p> -->

                <div v-if="selectedBody">
                    <div class="info">
                        <h2>Info</h2>
                        <p>Symbol: <Waypoint :id="selectedBody.symbol"></Waypoint></p>
                        <p>Faction: {{ selectedBody.faction.symbol}}</p>
                        <p>Type: {{ selectedBody.type }}</p>
                        <p>Location: {{ selectedBody.x }},{{ selectedBody.y }}</p>
                    </div>
                    <div class="traits">
                        <h2 v-if="selectedBody.traits.length > 0">Traits</h2>
                        <!-- TODO make this so it emits one thing about where to go and handle the difference options here -->
                        <Trait v-for="trait in selectedBody.traits" :key=trait.symbol :name=trait.name :desc=trait.description @GoToMarket="GoToMarket" @GoToShipyard="GoToShipyard"></Trait>
                    </div>

                    <div class="orbitals">
                        <h2 v-if="Object.values(selectedBody.orbitals).length > 0">Orbitals</h2>
                        <Waypoint v-for="orbital in selectedBody.orbitals" :key=orbital.symbol :id=orbital.symbol></Waypoint>
                        <!-- <p v-for="orbital in selectedBody.orbitals" :key=orbital.symbol>{{orbital.symbol}}</p> -->

                        <h2 v-if="selectedBody.orbits">Orbits</h2>
                        <!-- <p v-if="selectedBody.orbits">{{ selectedBody.orbits }}</p> -->
                        <Waypoint v-if="selectedBody.orbits" :id="selectedBody.orbits"></Waypoint>
                    </div>
                </div>

                <!-- <p v-if="selectedBody">{{ selectedBody.symbol }}</p> -->
            </div>

            <div id="canvasArea">
                <p  v-if="systemRef">{{ mouseX }}, {{ mouseY }}</p>
            </div>
        </div>
    </div>

  </main>
</template>

<style scoped>

#systemDrawing {
    display: flex;
    justify-content: space-between;
}

#canvasArea {
    display:flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-content: center;
    text-align: center;
}

#systemDrawing > * {
    flex: 1;
}

.fade-animation {
    text-align: center;
    animation-name: fade;
    animation-duration: 2s;
    animation-iteration-count: infinite;
}

@keyframes fade {
    0% {opacity: 1;}
    50% {opacity: 0.1;}
    100% {opacity: 1;}
}

.searchContainer {
    display: flex;
    flex-flow: column wrap;
    align-content: center;
    text-align: center;
}

.searchForm > * {
    margin: 0.5rem 0.5rem;
    padding: 0.25rem 0.5rem;

    border-radius: 10px;
    border: solid #fee9b4;

    flex-grow: 1;
}

.searchForm button {
    background-color: #fc6d45;
    flex-shrink: 2;
    flex-grow: 0;
}

.searchForm button:hover {
    background-color: #fee9b4;
}

</style>
