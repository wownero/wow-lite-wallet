<template>
    <table class="table wfs-explorer" v-if="proposals != null">
        <tbody>
            <tr v-for="proposal in proposals">
                <td>
                    <a v-bind:href="`https://funding.wownero.com/proposal/${proposal.id}`">
                        <span class="title">
                        {{proposal.headline}}
                        </span>

                        <span class="amount">
                            {{Number((proposal.funds_target/100)*proposal.funded_pct).toFixed(2)}} WOW remaining
                        </span> <small>({{Number(proposal.funded_pct).toFixed(1)}}% funded)</small>
                    </a>
                </td>
            </tr>
        </tbody>
    </table>
    <span class="error" v-else>No open proposals. <a href="https://funding.wownero.com/proposals">Add one!</a></span>
</template>

<script>
    export default {
        name: "WfsExplorer",
        data () {
            return {
                proposals: null
            }
        },
        mounted() {
            const axios = require('axios');
            axios.get('https://funding.wownero.com/api/1/proposals?status=2').then(response => {
                if(response.data.hasOwnProperty('data') && response.data.data.length !== 0) {
                    let proposals = response.data.data.sort(() => Math.random() - 0.5);

                    // only show 2 at max
                    if(proposals.length > 2){
                        proposals = proposals.slice(0,2);
                    }

                    this.proposals = proposals;
                }
            });
        }
    }
</script>

<style scoped>

</style>