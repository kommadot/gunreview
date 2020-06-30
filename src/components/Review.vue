<template>
    <div>        
        <div class="dim-layer">
            <div class="dimBg"></div>
            <div id="layer" class="pop-layer">
                <div class="pop-container">
                    <div class="pop-conts">
                        <!--content //-->    
                        <div style="width:100%; text-align:left;"> {{title}} </div>                        
                        <div style="width:100%; text-align:left;">평가하기</div>
                        
                        <div class="content">                            
                            <div class="grade_star">
                                <span class="ico_star star_rate" @mouseout="outStarRate()" @mouseover="moveStarRate($event)" @mousemove="moveStarRate($event)"  @click="clickStarRate($event)">
                                    <span class="ico_star inner_star" ref="innerStar" style="width:0%;"></span>
                                </span>
                            </div>
                            <div class="write_review">                                        
                                <textarea name="contents" class="review"></textarea>
                            </div>                                    
                        </div>

                        <div class="btn-r" style="text-align:center;">
                            <a href="#" class="btn-layerAdd">등록하기</a>
                            <a href="#" class="btn-layerClose">취소</a>                             
                        </div>

                        <div class="list">
                            
                        </div>
                        <!--// content-->
                    </div>
                </div>
            </div>    
        </div>
    </div>    
</template>

<script>
import axios from "axios";
export default {
    name: 'Review',
    props: ["title", "isClick"],    
    data(){
        return {
            reviewList: [],
            point:0,
        }
    },
    watch:{        
        isClick(){
			this.point=0;
            this.layer_popup('#layer');			
        }
    },
    methods:{
		//별점 관련 마우스 이벤트 처리
		//************************************
        outStarRate(){
            this.$refs.innerStar.style.width = this.point*20 + "%";
        },
        moveStarRate(event){
            var starWidth = 151;
            this.$refs.innerStar.style.width = (parseInt(event.offsetX / starWidth * 5)+1)*20 + "%";
        },
        clickStarRate(event){
            var starWidth = 151;
            this.point = parseInt(event.offsetX / starWidth * 5) + 1;
        },
		//************************************
		
		
		//마커 클릭 시 팝업 창 출력
        layer_popup(el) {            
            var $el = $(el);        //레이어의 id를 $el 변수에 저장
            var isDim = $el.prev().hasClass('dimBg');   //dimmed 레이어를 감지하기 위한 boolean 변수

            isDim ? $('.dim-layer').fadeIn() : $el.fadeIn();

            var $elWidth = ~~($el.outerWidth()),
                $elHeight = ~~($el.outerHeight()),
                docWidth = $(document).width(),
                docHeight = $(document).height();

            // 화면의 중앙에 레이어를 띄운다.
            if ($elHeight < docHeight || $elWidth < docWidth) {
                $el.css({
                    marginTop: -$elHeight /2,
                    marginLeft: -$elWidth/2
                })
            } else {
                $el.css({top: 0, left: 0});
            }

            $el.find('a.btn-layerClose').click(function(){                
                isDim ? $('.dim-layer').fadeOut() : $el.fadeOut(); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
                return false;
            });

            $('.layer .dimBg').click(function(){
                $('.dim-layer').fadeOut();
                return false;
            });
        },
    }
}
</script>

<style scoped>
    * {
    margin: 0;
    padding: 0;
    }

    body {
    margin: 100px;
    }

    .pop-layer .pop-container {
    padding: 20px 25px;
    }

    .pop-layer p.ctxt {
    color: #666;
    line-height: 25px;
    }

    .pop-layer .btn-r {
    width: 100%;
    margin: 10px 0 20px;
    padding-top: 10px;
    text-align: right;
    }

    .pop-layer {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    height: auto;
    max-height: 90%;    
    background-color: #fff;
    border: 5px solid #3571B5;
    z-index: 10;
    }

    .dim-layer {
    display: none;
    position: fixed;
    _position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    }

    .dim-layer .dimBg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: .5;
    filter: alpha(opacity=50);
    }

    .dim-layer .pop-layer {
    display: block;
    }

    a.btn-layerClose, a.btn-layerAdd{
    text-decoration:none;
    display: inline-block;
    height: 25px;
    padding: 0 14px 0;
    border: 1px solid #304a8a;
    background-color: #3f5a9d;
    font-size: 13px;
    color: #fff;
    line-height: 25px;
    }

    a.btn-layerClose:hover {
    border: 1px solid #091940;
    background-color: #1f326a;
    color: #fff;
    }

    img {
        max-width: 800px;
        max-height: 640px;
    }

    textarea {
        -webkit-writing-mode: horizontal-tb !important;
        text-rendering: auto;
        color: -internal-light-dark-color(black, white);
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        display: inline-block;
        text-align: start;
        -webkit-appearance: textarea;
        background-color: -internal-light-dark-color(rgb(255, 255, 255), rgb(59, 59, 59));
        -webkit-rtl-ordering: logical;
        flex-direction: column;
        resize: auto;
        cursor: text;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        margin: 0em;
        font: 400 13.3333px Arial;
        border-width: 1px;
        border-style: solid;
        border-color: -internal-light-dark-color(rgb(118, 118, 118), rgb(195, 195, 195));
        border-image: initial;
        padding: 2px;
    }

    .review {
        overflow: visible;
        width: 595px;
        height: 44px;
        padding: 14px 23px 9px 20px;
        line-height: 22px;
        border: 0 none;
        color: #444;
        resize: none;
        -webkit-appearance: none;
    }

    .content {
        margin-top: 11px;
        border: 1px solid #ddd;
    }

    a {
        margin-left:10px;
    }

    .ico_star {
        display: block;
        background: url('/star.png') no-repeat;
    }

    .star_rate {
        width: 151px;
        height: 27px;
        background-position: 0 0;
    }

    .star_rate .inner_star {
        height: 100%;
        background-position: 0 -30px;
    }
</style>