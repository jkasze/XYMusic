import { XYEventStore } from "../event_store/index"

import { getRankings  } from "../service/api_music"

const rankingStore = new XYEventStore({
    state: {
        hotRanking: {}
    },
    actions: {
        getRankingDataAction(ctx) {
            getRankings(1).then(res => {
                ctx.hotRanking = res.playlist
            })
        }
    }
})

export {
    rankingStore
}