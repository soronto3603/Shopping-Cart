// 쇼핑카트 정보와 쇼핑카트 정보중 선택된 것들이 분리되어 있음

// 쇼핑카트 정보 데이터 json
var cartData;
// 쇼핑카트 데이터 중 선택된 것들 리스트
const checklist=[];

// HTML 템플릿
const gen_item_summary=(idx=0)=>{
    return `<div id=summary class=summary_item>
        ${cartData[idx].goodsNm} 외 ${cartData.length-1} 종
    </div>`
}
const gen_item=(idx)=>{
    return (`<div id=item${idx} class=item>
        <div class=item_sel>
            <div id=check_box_${idx} class="check_box not-checked" onclick="click_checkbox('${idx}','a')">
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z"/></svg>
            </div>
        </div>
        <div>
            <img src="${cartData[idx].goodsImage}" />
        </div>
        <div class=item_des>
            <div class=item_des_title>${cartData[idx].goodsNm}</div>
            <div class=item_des_price>${won(cartData[idx].price.baseGoodsPrice)}</div>
        </div>
        <div class=quentity>
            <div class=quent_btn onclick="stock_opr(${idx},'-')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 10h24v4h-24z"/></svg>
            </div>
            <div id=q${idx} class=quent_res>${cartData[idx].goodsCnt}</div>
            <div class=quent_btn onclick="stock_opr(${idx},'+')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
            </div>
        </div>
        <div class=item_prc>
            ${won(cartData[idx].price.baseGoodsPrice)}
        </div>
        <div class=item_del onclick="del_item(${idx})">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
        </div>
    </div>`);
}

// 쇼핑카트 데이터 GET 요청
const init=()=>{
    // getting data
    $.get("./cart.json",(d)=>{
        cartData=d;
    // drawing page 
    }).done(()=>{
        itemlist_setting();
        // checkbox msg
        click_checkbox(null,'msg');
    });
}

// 쇼핑카트 정보를 기반으로 아이템리스트 view 를 만들고 dom에 넣음
const itemlist_setting=()=>{
    // 쇼핑카트 정보가 없다면 아이템리스트 view를 만들지 않음
    if(cartData.length==0){
        document.getElementById("table_body").innerHTML="";
        return -1;
    }
    // 테이블 최상단 정보 요약 템플릿으로부터 정보 요약 view를 만듬
    var html=gen_item_summary();

    // 아이템리스트를 새로 만들때마다 checklist를 초기화함
    checklist.length=0;
    
    for(var i in cartData){
        html+=gen_item(i);

        // checkbox list init
        checklist.push(0);
    }
    document.getElementById("table_body").innerHTML=html;
}

// 쇼핑카트 최종 금액과 할인, 배송비를 출력할 부분 view를 형성하여 바꾸지않고
// 부분부분 텍스트 수정만 함
const result_setting=()=>{
    // total prc
    var total_prc=0;

    for(var i in checklist){
        if(checklist[i]==1)total_prc+=cartData[i].price.baseGoodsPrice*cartData[i].goodsCnt;
    }
    document.getElementById("base_total_prc").innerHTML=won(total_prc);
    // total dc
    var total_dc=0;
    // for(var i in cartData){

    // }
    // document.getElementById("total_dc").innerHTML=total_dc;
    // delevery prc
    var dele_prc=0;
    for(var i in checklist){
        if(checklist[i]==1)dele_prc+=cartData[i].deliveryInfo.goodsDeliveryPrice;
    }
    document.getElementById("delevery_prc").innerHTML=won(dele_prc);
    // total prc result
    const prc_result=total_prc-total_dc+dele_prc;
    document.getElementById("prc_result").innerHTML=won(prc_result); 
}
// 체크박스가 눌릴때의 이벤트 
// id=> 해당체크박스의 id
// val=> 해당 체크박스의 단일 toggle요청인지 전체 toggle요청인지 체크박스 메세지만 요청인지 식별
// val=> { 'a' : 단일, 'all':전체 ,'msg':메세지만}
const click_checkbox=(id,val)=>{
    if(val=="all"){
        if($("#"+id).css("backgroundColor")=="rgb(255, 255, 255)"){
            $("#check_all_top").removeClass("not-checked");
            $("#check_all_top").addClass("checked");
            $("#check_all_footer").removeClass("not-checked");
            $("#check_all_footer").addClass("checked");
            for(var i in checklist){
                $("#check_box_"+i).removeClass("not-checked");
                $("#check_box_"+i).addClass("checked");
                checklist[i]=1;
            }
        }else{
            $("#check_all_top").removeClass("checked");
            $("#check_all_top").addClass("not-checked");
            $("#check_all_footer").removeClass("checked");
            $("#check_all_footer").addClass("not-checked");
            for(var i in checklist){
                $("#check_box_"+i).removeClass("checked");
                $("#check_box_"+i).addClass("not-checked");
                checklist[i]=0;
            }

        }
    }else if(val=="msg"){

    }else{
        if($("#check_box_"+id).css("backgroundColor")=="rgb(255, 255, 255)"){
            $("#check_box_"+id).removeClass("not-checked");
            $("#check_box_"+id).addClass("checked");
            checklist[id]=1;
        }else{
            $("#check_box_"+id).removeClass("checked");
            $("#check_box_"+id).addClass("not-checked");
            checklist[id]=0;
        }
    }
    // 메세지부분 수정
    const msg=`(${checklist.filter((v)=>{return v==1}).length}/${checklist.filter((v)=>{return v!=-1}).length})`;
    document.getElementById("select_message_top").innerHTML=msg;
    document.getElementById("select_message_footer").innerHTML=msg;

    // 체크박스 토글에의해 결과가 바뀔 수 있으므로 수정
    result_setting();
}
// 아이템 한개 삭제
const del_item=(idx)=>{
    // cartData.splice(idx,1);
    // checklist.splice(idx,1);
    cartData[idx]=-1;
    checklist[idx]=-1;
    document.getElementById("item"+idx).style.display="none";

    // 아이템 삭제에의해 결과가 바뀜으로 수정
    // 체크박스 해제
    // 아이템 삭제
    result_setting();
    // 아이템 삭제에의해 체크박스 메세지 수정
    click_checkbox(null,"msg");
    // 테이블 요약 메세지 수정
    if( cartData.filter((v)=>{return v==-1}).length == cartData.length ){
        document.getElementById("summary").innerHTML="";
    }else{
        for(var i in cartData){
            if(cartData[i]!=-1){
                if(cartData.filter((v)=>{return v!=-1}).length-1 > 0){
                    document.getElementById("summary").innerHTML=cartData[i].goodsNm+" 외 "+(cartData.filter((v)=>{return v!=-1}).length-1)+" 종";
                }else{
                    document.getElementById("summary").innerHTML=cartData[i].goodsNm;
                }
                return;
            }
        }
    }

    
}
// 전체 데이터 삭제
const del_all=()=>{
    // 쇼핑카트 데이터와 체크리스트 초기화
    cartData.length=0;
    checklist.length=0;

    // 체크박스 해제 아이템 삭제
    result_setting();
    // 체크박스 메세지 수정
    click_checkbox(null,"msg");
    // 화면 출력되는 아이템 전체삭제
    itemlist_setting();
}
// 원화 표시를 위해 숫자 3칸마다 ','를 찍어 구분하고 원을 붙임
const won=(v)=>{
    return (v+"원").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// 주문 수량 변경 이벤트
// id는 아이템 id
// opr => {'+':더하기,'-':빼기}
const stock_opr=(id,opr)=>{
    
    var stock=$("#q"+id).html()*1;
    if(opr=="+"){
        if(stock-1<=1000){
            $("#q"+id).html(stock+1);
            cartData[id].goodsCnt+=1;
        }
    }else{
        if(stock-1>=0){
            $("#q"+id).html(stock-1);
            cartData[id].goodsCnt-=1;
        }

    }

    result_setting();
}

window.onload=()=>{
    init();
}