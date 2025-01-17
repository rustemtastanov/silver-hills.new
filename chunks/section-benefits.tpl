<app-benefits inline-template :in-view="inView.benefits">
	<section class="section s--benefits inview" data-inview="benefits">
		<div class="benefits-tabs hidden-xs" v-if="inView">
			<div class="benefits-tab" v-for="(Slide, index) in Slides" :key="index" :class="{'active': Selected==index}" @click.prevent="Selected=index">
				<div class="value">
					<app-counter :value="Slide.value"></app-counter>
					<span class="visible-xs-inline">{{ Slide.value }}</span>
				</div>
				<div class="title" v-html="Slide.title"></div>
			</div>
			<div class="line"></div>
		</div>
		<swiper class="swiper benefits-items hidden-xs" ref="slider" :options="options" v-if="inView">
			<swiper-slide v-for="(Slide, index) in Slides" class="benefits-slide swiper-slide" :key="index">
				<picture class="img swiper-img">
					<source :data-srcset="Slide.webp +' 1x, '+ Slide.webp2x +' 2x'" class="swiper-lazy img--cover" type="image/webp" />
					<img width="1204" height="458" :data-srcset="Slide.thumb +' 1x, '+ Slide.thumb2x +' 2x'" class="swiper-lazy img--cover" alt="photo" />
				</picture>
				<div class="inner" :class="'inner-' + Slide.pos">
					<div class="title" v-html="Slide.subtitle"></div>
					<div class="text" v-html="Slide.text"></div>
				</div>
			</swiper-slide>
		</swiper>
		<div class="benefits-items visible-xs" v-if="inView">
			<div class="benefits-slide" v-for="(Slide, index) in Slides" :key="index">
				<picture class="img primary" data-role="lazy">
					<source :data-srcset="Slide.webp_phone +' 1x, '+ Slide.webp_phone2x +' 2x'" type="image/webp" />
					<img width="394" height="220" :data-srcset="Slide.thumb_phone +' 1x, '+ Slide.thumb_phone2x +' 2x'" alt="photo" class="lazy img--cover" />
				</picture>
				<div class="head">
					<div class="value">{{ Slide.value }}</div>
					<div class="title" v-html="Slide.title"></div>
				</div>
				<div class="inner">
					<div class="subtitle" v-html="Slide.subtitle"></div>
					<div class="text" v-html="Slide.text_phone"></div>
				</div>
			</div>
		</div>
	</section>
</app-benefits>