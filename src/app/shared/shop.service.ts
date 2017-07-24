import { Injectable } from '@angular/core';

@Injectable()
export class ShopService {

  public items: any [] = [];
  public selectedCategory: string = '';

  constructor() {
    this.items = [{
      image: 'img-3.png',
      name: 'DXA Body Composition',
      title: 'DXA Body Comp Scan',
      category: 'Body Comp',
      most_popular: true,
      new_release: false,
      learn_more: false,
      url: '',
      description: `"I use the DXA scan to make sure I don't lose muscle on my fat loss programs. It's the most detailed and accurate way I've found."<br /><br />
        - Samantha P<br /><br /><br />
        <b>Why:</b> The most industry-recognized, accurate, and reliable method for measuring your body composition<br /><br />
        <b>How:</b> Simple 7 minute test to supercharge your motivation & know the exact location & percentage of fat, bone & lean muscle throughout your body.<br />
        Includese visceral fat and muscle symmetry analysis.`
    },
    {
      image: 'img-10.png',
      name: 'Fit3D Body Scan',
      title: '3D Body Scan',
      category: 'Body Comp',
      most_popular: false,
      new_release: false,
      learn_more: false,
      url: '',
      description: `"Incredibly detailed images! I could tell my HIIT class, my jogging, and the everday gym workouts where contributing to all of the results from the challenge."<br /><br />
        - Andre Anderson<br /><br /><br />
        Get hundreds of measurements, including lengths, widths, volumes, and posture analysis.<br /><br />
        <ul>
        <li>Extracts more than 400 different measurements from body:<br /></li>
        <li>Used by leading universities to study morbidity, nutrition, psychology, and body shape.<br /></li>
        <li>3D Image of your body from a simple 40 second scane.</li>
        </ul>
      `
    },
    {
      image: 'img-5.png',
      name: 'Treadmill Vo2max Test',
      title: 'Vo2max Fitness Test',
      category: 'Fitness',
      most_popular: true,
      new_release: false,
      learn_more: false,
      url: '',
      description: `"The Vo2max test specifically uncovered reasons that I had less that optimal energy.
        This information helped me customize my plan to reach a new personal best!"<br /><br />
        - Jeff Logan<br /><br /><br />
        <b>Why: </b>Pinpoint your precise cardio fitness level, discover your fat burning zones and learn how to exercise more effectively.<br /><br />
        <b>How: </b>Simple 15 minute test to discover how to optimize your cardio fitness and get invaluable insights into your overall health such as your risk for early death.
      `
    },
    {
      image: 'img-2.png',
      name: 'Bike Vo2max Test',
      title: 'Bike Vo2max Test',
      category: 'Fitness',
      most_popular: false,
      new_release: false,
      learn_more: false,
      url: '',
      description: `"My results showed me how to optimize my HIIT training and recovery workouts. So cool."<br /><br />
        - Stephanie Galli<br /><br /><br />
        Pinpoint your precise cardio fitness level, discover your fat burning zones and learn how to exercise more effectively.
      `

    },
    {
      image: 'img-1.png',
      name: 'ARX Fit',
      title: 'Adaptive Resistance Exercise (ARX)',
      category: 'Fitness',
      most_popular: false,
      new_release: false,
      learn_more: false,
      url: '',
      description: `"It's like wrestling with a terminator robot. I feel amazing after every workout (only need two a week)<br />
        My lean mass increased 5lbs (according to my DXA scan)"<br /><br />
        - Jason P<br /><br /><br />
        <b>Why: </b>Build muscle, increase bone density & lsoe body fat in a fraction of the time<br /><br />
        <b>How: </b>15-minute workout where the weight is adapted to you and provides the perfect amount of resistance that you can handle at each point within the range-of-motion.
      `
    },
    {
      image: 'img-9.png',
      name: 'RMR Analysis',
      title: 'Resting Metabolic Rate Analysis',
      category: 'Metabolism',
      most_popular: false,
      new_release: false,
      learn_more: false,
      url: '',
      description: `"I had no idea I wasn't eating enough calories. It explained why I was gaining weight while on a strict diet.
        Tracking my RMR alongside my DXA helped me see I was even losing lean mass! Now I know how much to eat to optimize my plan"<br /><br />
        - Jessica F. DexaFit Atlanta<br /><br /><br />
        <b>Why: </b>Personalize your diet and training & reveal changes in your metabolism that help you troubleshoot plateaus.<br /><br />
        <b>How: </b>Relax and breathe in a recliner for 15 minutes
      `
    },
    {
      image: 'img-4.png',
      name: 'Biomarker Analysis',
      title: 'Biomarker Analysis',
      category: 'Biomarkers',
      most_popular: true,
      new_release: true,
      learn_more: true,
      url: 'https://www.dexafit.com/shop-dexafit/?category=Biomarker+Analysis#productList',
      description: `"Who knew you could learn so much about your body with just a few drops of blood! I used my results to track how my cholesterol, 
        testosterone, and thyroid health changed with my diet and sleep patterns."<br /><br />
        - Jerry Green DexaFit Atlanta<br /><br /><br />
        If your goal is to not only stop disease but to also perform at your peak physical and cognitive capacity, 
        this panel is designed to optimize your unique physiology.
      `
    },
    {
      image: 'img-6.png',
      name: 'Food Intolerance',
      title: 'Food Intolerance',
      category: 'Food',
      most_popular: true,
      new_release: true,
      learn_more: true,
      url: 'https://www.dexafit.com/shop-dexafit/?category=Food+Intolerance+Kits#productList',
      description: `"So it turns out what I thought was healthy - tomatoes, sweet potatoes, and oatmeal, were the absolutely worst foods 
        to eat on a daily basis! My results came back and I immediately stopped eating those foods. I lost 14 lbs of fat in 1 month!".<br /><br />
        - Kaitlen G, DexaFit SF<br /><br /><br />
        Even healthy foods will make you sick, bloated, and fat. Discover your food intolerances with the most accurate test available today.
        You can do it at home too. Which is nice. 
      `
    },
    {
      image: 'img-7.png',
      name: 'Microbiome Analysis',
      title: 'Microbiome Analysis',
      category: 'Microbiome',
      most_popular: false,
      new_release: true,
      learn_more: true,
      url: 'https://www.dexafit.com/shop-dexafit/?category=Microbiome+Analysis#productList',
      description: `"My SmartGut analysis proved monumental to helping me understand why I was stuck at a plataeu and not seeing any progress.
        It turns out I had a significantly imbalanced strain of pathogenic bacteria wreaking havoc on my metabolism!"<br /><br />
        - Karen, DexaFit Chicago<br /><br /><br />
        The first sequencing-based microbiome screening test. Detect beneficial and pathogenic microorganisms associated with infections, 
        lifestyle choices, and gut conditions IBD and IBS.
      `
    },
    {
      image: 'img-8.png',
      name: 'FitnessGenes DNA',
      title: 'FitnessGenes DNA',
      category: '',
      most_popular: false,
      new_release: true,
      learn_more: true,
      url: 'https://www.dexafit.com/shop-dexafit/?category=Fitness+Genes#productList',
      description: `"I could not believe how accurate my results were! I learned so much about myself, including my diet, exercise, 
        genetics and even which sleep patterns work best for me. You will learn exactly how DNA impacts your weight loss tactics.<br /><br />
        - Kristin S DexaFit SF<br /><br /><br />
        Discover your genetic blueprint by analyzing your DNA and learning how 40+ genes are related to your fitness, health and nutrition.
      `
    }
    ];
  }

  getByCategory (category: string) {
    var res: any [] = [];
    for( var i = 0; i < this.items.length; i++) {
      if (this.items[i].category == category) res.push(this.items[i]);
    }
    return res;
  }

  getPopularItems () {
    var res: any [] = [];
    for( var i = 0; i < this.items.length; i++) {
      if (this.items[i].most_popular == true) res.push(this.items[i]);
    }
    return res;
  }

  getNewReleasedItems () {
    var res: any [] = [];
    for( var i = 0; i < this.items.length; i++) {
      if (this.items[i].new_release == true) res.push(this.items[i]);
    }
    return res;
  }

  setSelectedCategory (category: string) {
    this.selectedCategory = category;
  }

  getSelectedCategory () {
    return this.selectedCategory;
  }
}