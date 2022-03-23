import NormalMoves from "./ModifyDiv/NormalMoves.js";
import Magnify from "./ModifyDiv/Magnify.js";
import NormalCardTopHalf from "./ModifyDiv/NormalCardTopHalf.js";


const NormalModifyDiv = `<div class="modifyDiv displayNone">
                        ${NormalCardTopHalf}
                        ${Magnify}
                        ${NormalMoves}
                    </div>`

export default NormalModifyDiv