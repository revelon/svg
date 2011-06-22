/* ************************  BANDIT 1. TEMPLATE **************************** */
    // badit 1. template
    tmpDefs['b1'] = new Array();
    tmpDefs['b1']['template'] = 'template_b1';
    tmpDefs['b1']['points'] = 3;
    tmpDefs['b1']['x1'] = 110;          tmpDefs['b1']['y1'] = 250;
    tmpDefs['b1']['x2'] = 180;          tmpDefs['b1']['y2'] = 260;
    tmpDefs['b1']['BBwidth'] = 36;      tmpDefs['b1']['BBheight'] = 89;
    tmpDefs['b1']['BBkoefX'] = 14;      tmpDefs['b1']['BBkoefY'] = 7;
    tmpDefs['b1']['mask'] = 'mask_b1';

    // appearing animation of bandit 1
    tmpDefs['b1']['appear'] = new Array();
    tmpDefs['b1']['appear']['elem'] = 'animate';
    tmpDefs['b1']['appear']['attr'] = 'x';
    tmpDefs['b1']['appear']['dur'] = 4200; // ms
    tmpDefs['b1']['appear']['by'] = 200;
    tmpDefs['b1']['appear']['audio'] = '';

    // firing/shooting animation of bandit 1
    tmpDefs['b1']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b1']['fire']['template'] = 'template_fire1';
    tmpDefs['b1']['fire']['x'] = 5;
    tmpDefs['b1']['fire']['y'] = 7;
    tmpDefs['b1']['fire']['timeOffset'] = 100; // ms
    tmpDefs['b1']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 1
    tmpDefs['b1']['die'] = new Array();
    tmpDefs['b1']['die']['elem'] = 'animate';
    tmpDefs['b1']['die']['attr'] = 'y';
    tmpDefs['b1']['die']['dur'] = 500; // ms
    tmpDefs['b1']['die']['by'] = 200;
    tmpDefs['b1']['die']['audio'] = 'ugh2';

/* ************************  BANDIT 2. TEMPLATE **************************** */
    // badit 2. template
    tmpDefs['b2'] = new Array();
    tmpDefs['b2']['template'] = 'template_b2';
    tmpDefs['b2']['points'] = 2;
    tmpDefs['b2']['x1'] = 150;          tmpDefs['b2']['y1'] = 117;
    tmpDefs['b2']['x2'] = 210;          tmpDefs['b2']['y2'] = 125;
    tmpDefs['b2']['BBwidth'] = 15;      tmpDefs['b2']['BBheight'] = 25;
    tmpDefs['b2']['BBkoefX'] = 2;      tmpDefs['b2']['BBkoefY'] = 22;
    tmpDefs['b2']['mask'] = 'mask_b2';

    // appearing animation of bandit 2
    tmpDefs['b2']['appear'] = new Array();
    tmpDefs['b2']['appear']['elem'] = 'animate';
    tmpDefs['b2']['appear']['attr'] = 'x';
    tmpDefs['b2']['appear']['dur'] = 3000; // ms
    tmpDefs['b2']['appear']['by'] = 100;
    tmpDefs['b2']['appear']['audio'] = '';

    // firing/shooting animation of bandit 2
    tmpDefs['b2']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b2']['fire']['template'] = 'template_fire2';
    tmpDefs['b2']['fire']['x'] = 15;
    tmpDefs['b2']['fire']['y'] = 4;
    tmpDefs['b2']['fire']['timeOffset'] = 500; // ms
    tmpDefs['b2']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 2
    tmpDefs['b2']['die'] = new Array();
    tmpDefs['b2']['die']['elem'] = 'animate';
    tmpDefs['b2']['die']['attr'] = 'y';
    tmpDefs['b2']['die']['dur'] = 500; // ms
    tmpDefs['b2']['die']['by'] = 70;
    tmpDefs['b2']['die']['audio'] = 'ugh5';

/* ************************  INNOCENT BANDIT 2 - 13. TEMPLATE **************************** */
    // badit 2 - 13. template
    tmpDefs['b13'] = new Array();
    tmpDefs['b13']['template'] = 'template_b2i';
    tmpDefs['b13']['points'] = -5;
    tmpDefs['b13']['x1'] = 150;          tmpDefs['b13']['y1'] = 137;
    tmpDefs['b13']['x2'] = 230;          tmpDefs['b13']['y2'] = 137;
    tmpDefs['b13']['BBwidth'] = 13;      tmpDefs['b13']['BBheight'] = 28;
    tmpDefs['b13']['BBkoefX'] = -30;      tmpDefs['b13']['BBkoefY'] = 6;
    tmpDefs['b13']['mask'] = 'mask_b2';

    // appearing animation of bandit 2 - 13
    tmpDefs['b13']['appear'] = new Array();
    tmpDefs['b13']['appear']['elem'] = 'animate';
    tmpDefs['b13']['appear']['attr'] = 'x';
    tmpDefs['b13']['appear']['dur'] = 3000; // ms
    tmpDefs['b13']['appear']['by'] = 100;
    tmpDefs['b13']['appear']['audio'] = '';

    // firing/shooting animation of bandit 2 - 13
    tmpDefs['b13']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b13']['fire']['template'] = 'template_fire2';
    tmpDefs['b13']['fire']['x'] = 15;
    tmpDefs['b13']['fire']['y'] = 4;
    tmpDefs['b13']['fire']['timeOffset'] = 500; // ms
    tmpDefs['b13']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 2 - 13
    tmpDefs['b13']['die'] = new Array();
    tmpDefs['b13']['die']['elem'] = 'animate';
    tmpDefs['b13']['die']['attr'] = 'y';
    tmpDefs['b13']['die']['dur'] = 500; // ms
    tmpDefs['b13']['die']['by'] = 70;
    tmpDefs['b13']['die']['audio'] = 'babkaugh';



/* ************************  BANDIT 3. TEMPLATE **************************** */
    // badit 3. template
    tmpDefs['b3'] = new Array();
    tmpDefs['b3']['template'] = 'template_b3';
    tmpDefs['b3']['points'] = 5;
    tmpDefs['b3']['x1'] = 90;           tmpDefs['b3']['y1'] = 450;
    tmpDefs['b3']['x2'] = 490;          tmpDefs['b3']['y2'] = 450;
    tmpDefs['b3']['BBwidth'] = 110;     tmpDefs['b3']['BBheight'] = 250;
    tmpDefs['b3']['BBkoefX'] = 20;      tmpDefs['b3']['BBkoefY'] = 20;
    tmpDefs['b3']['mask'] = 'mask_b3';

    // appearing animation of bandit 3
    tmpDefs['b3']['appear'] = new Array();
    tmpDefs['b3']['appear']['elem'] = 'animate';
    tmpDefs['b3']['appear']['attr'] = 'y';
    tmpDefs['b3']['appear']['dur'] = 1500; // ms
    tmpDefs['b3']['appear']['by'] = -260;
    tmpDefs['b3']['appear']['audio'] = '';

    // firing/shooting animation of bandit 3
    tmpDefs['b3']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b3']['fire']['template'] = 'template_fire3';
    tmpDefs['b3']['fire']['x'] = 3;
    tmpDefs['b3']['fire']['y'] = 48;
    tmpDefs['b3']['fire']['timeOffset'] = 500; // ms
    tmpDefs['b3']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 3
    tmpDefs['b3']['die'] = new Array();
    tmpDefs['b3']['die']['elem'] = 'animate';
    tmpDefs['b3']['die']['attr'] = 'y';
    tmpDefs['b3']['die']['dur'] = 350; // ms
    tmpDefs['b3']['die']['by'] = 200;
    tmpDefs['b3']['die']['audio'] = 'ugh5';


/* ************************  BANDIT 4. TEMPLATE **************************** */
    // badit 4. template
    tmpDefs['b4'] = new Array();
    tmpDefs['b4']['template'] = 'template_b4';
    tmpDefs['b4']['points'] = 5;
    tmpDefs['b4']['x1'] = 690;          tmpDefs['b4']['y1'] = 40;
    tmpDefs['b4']['x2'] = 725;          tmpDefs['b4']['y2'] = 47;
    tmpDefs['b4']['BBwidth'] = 30;      tmpDefs['b4']['BBheight'] = 22;
    tmpDefs['b4']['BBkoefX'] = 4;       tmpDefs['b4']['BBkoefY'] = 20;
    tmpDefs['b4']['mask'] = 'mask_b4';

    // appearing animation of bandit 4
    tmpDefs['b4']['appear'] = new Array();
    tmpDefs['b4']['appear']['elem'] = 'animate';
    tmpDefs['b4']['appear']['attr'] = 'x';
    tmpDefs['b4']['appear']['dur'] = 1000; // ms
    tmpDefs['b4']['appear']['by'] = -70;
    tmpDefs['b4']['appear']['audio'] = '';

    // firing/shooting animation of bandit 4
    tmpDefs['b4']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b4']['fire']['template'] = 'template_fire2';
    tmpDefs['b4']['fire']['x'] = 27;
    tmpDefs['b4']['fire']['y'] = 2;
    tmpDefs['b4']['fire']['timeOffset'] = 500; // ms
    tmpDefs['b4']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 4
    tmpDefs['b4']['die'] = new Array();
    tmpDefs['b4']['die']['elem'] = 'animate';
    tmpDefs['b4']['die']['attr'] = 'y';
    tmpDefs['b4']['die']['dur'] = 500; // ms
    tmpDefs['b4']['die']['by'] = 150;
    tmpDefs['b4']['die']['audio'] = 'ugh3';


/* ************************  INNOCENT - BANDIT 4 - 10. TEMPLATE **************************** */
    // innocent - badit 4-10. template
    tmpDefs['b10'] = new Array();
    tmpDefs['b10']['template'] = 'template_b4i';
    tmpDefs['b10']['points'] = -5;
    tmpDefs['b10']['x1'] = 690;          tmpDefs['b10']['y1'] = 21;
    tmpDefs['b10']['x2'] = 725;          tmpDefs['b10']['y2'] = 21;
    tmpDefs['b10']['BBwidth'] = 22;      tmpDefs['b10']['BBheight'] = 35;
    tmpDefs['b10']['BBkoefX'] = 16;       tmpDefs['b10']['BBkoefY'] = 28;
    tmpDefs['b10']['mask'] = 'mask_b4';

    // appearing animation of - bandit 4 - 10
    tmpDefs['b10']['appear'] = new Array();
    tmpDefs['b10']['appear']['elem'] = 'animate';
    tmpDefs['b10']['appear']['attr'] = 'x';
    tmpDefs['b10']['appear']['dur'] = 1000; // ms
    tmpDefs['b10']['appear']['by'] = -70;
    tmpDefs['b10']['appear']['audio'] = '';

    // firing/shooting animation of bandit 4 - 10
    tmpDefs['b10']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b10']['fire']['template'] = 'template_fire2';
    tmpDefs['b10']['fire']['x'] = 27;
    tmpDefs['b10']['fire']['y'] = 2;
    tmpDefs['b10']['fire']['timeOffset'] = 500; // ms
    tmpDefs['b10']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 4 - 10
    tmpDefs['b10']['die'] = new Array();
    tmpDefs['b10']['die']['elem'] = 'animate';
    tmpDefs['b10']['die']['attr'] = 'y';
    tmpDefs['b10']['die']['dur'] = 500; // ms
    tmpDefs['b10']['die']['by'] = 150;
    tmpDefs['b10']['die']['audio'] = 'ugh3';


/* ************************  BANDIT 5. TEMPLATE **************************** */
    // badit 5. template
    tmpDefs['b5'] = new Array();
    tmpDefs['b5']['template'] = 'template_b5';
    tmpDefs['b5']['points'] = 3;
    tmpDefs['b5']['x1'] = 756;          tmpDefs['b5']['y1'] = 160;
    tmpDefs['b5']['x2'] = 766;          tmpDefs['b5']['y2'] = 170;
    tmpDefs['b5']['BBwidth'] = 15;      tmpDefs['b5']['BBheight'] = 25;
    tmpDefs['b5']['BBkoefX'] = 3;       tmpDefs['b5']['BBkoefY'] = 25;
    tmpDefs['b5']['mask'] = 'mask_b5';

    // appearing animation of bandit 5
    tmpDefs['b5']['appear'] = new Array();
    tmpDefs['b5']['appear']['elem'] = 'animate';
    tmpDefs['b5']['appear']['attr'] = 'x';
    tmpDefs['b5']['appear']['dur'] = 1000; // ms
    tmpDefs['b5']['appear']['by'] = -27;
    tmpDefs['b5']['appear']['audio'] = 'creak';

    // firing/shooting animation of bandit 5
    tmpDefs['b5']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b5']['fire']['template'] = 'template_fire2';
    tmpDefs['b5']['fire']['x'] = 4;
    tmpDefs['b5']['fire']['y'] = 13;
    tmpDefs['b5']['fire']['timeOffset'] = 500; // ms
    tmpDefs['b5']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 5
    tmpDefs['b5']['die'] = new Array();
    tmpDefs['b5']['die']['elem'] = 'animate';
    tmpDefs['b5']['die']['attr'] = 'y';
    tmpDefs['b5']['die']['dur'] = 750; // ms
    tmpDefs['b5']['die']['by'] = 250;
    tmpDefs['b5']['die']['audio'] = 'ugh5';


/* ************************  BANDIT 6. TEMPLATE **************************** */
    // badit 6. template
    tmpDefs['b6'] = new Array();
    tmpDefs['b6']['template'] = 'template_b6';
    tmpDefs['b6']['points'] = 3;
    tmpDefs['b6']['x1'] = 54;          tmpDefs['b6']['y1'] = 115;
    tmpDefs['b6']['x2'] = 54;          tmpDefs['b6']['y2'] = 115;
    tmpDefs['b6']['BBwidth'] = 14;     tmpDefs['b6']['BBheight'] = 25;
    tmpDefs['b6']['BBkoefX'] = 7;      tmpDefs['b6']['BBkoefY'] = 25;
    tmpDefs['b6']['mask'] = 'mask_b6';

    // appearing animation of bandit 6
    tmpDefs['b6']['appear'] = new Array();
    tmpDefs['b6']['appear']['elem'] = 'animate';
    tmpDefs['b6']['appear']['attr'] = 'y';
    tmpDefs['b6']['appear']['dur'] = 1400; // ms
    tmpDefs['b6']['appear']['by'] = -33;
    tmpDefs['b6']['appear']['audio'] = 'creak';

    // firing/shooting animation of bandit 6
    tmpDefs['b6']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b6']['fire']['template'] = 'template_fire2';
    tmpDefs['b6']['fire']['x'] = 16;
    tmpDefs['b6']['fire']['y'] = 8;
    tmpDefs['b6']['fire']['timeOffset'] = 500; // ms
    tmpDefs['b6']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 6
    tmpDefs['b6']['die'] = new Array();
    tmpDefs['b6']['die']['elem'] = 'animate';
    tmpDefs['b6']['die']['attr'] = 'y';
    tmpDefs['b6']['die']['dur'] = 550; // ms
    tmpDefs['b6']['die']['by'] = 170;
    tmpDefs['b6']['die']['audio'] = 'ugh4';


/* ************************  BANDIT 7. TEMPLATE **************************** */
    // badit 7. template
    tmpDefs['b7'] = new Array();
    tmpDefs['b7']['template'] = 'template_b7';
    tmpDefs['b7']['points'] = 3;
    tmpDefs['b7']['x1'] = 605;          tmpDefs['b7']['y1'] = 178;
    tmpDefs['b7']['x2'] = 610;          tmpDefs['b7']['y2'] = 180;
    tmpDefs['b7']['BBwidth'] = 20;      tmpDefs['b7']['BBheight'] = 25;
    tmpDefs['b7']['BBkoefX'] = 4;       tmpDefs['b7']['BBkoefY'] = 27;
    tmpDefs['b7']['mask'] = 'mask_b7';

    // appearing animation of bandit 7
    tmpDefs['b7']['appear'] = new Array();
    tmpDefs['b7']['appear']['elem'] = 'animate';
    tmpDefs['b7']['appear']['attr'] = 'x';
    tmpDefs['b7']['appear']['dur'] = 1000; // ms
    tmpDefs['b7']['appear']['by'] = 18;
    tmpDefs['b7']['appear']['audio'] = 'creak';

    // firing/shooting animation of bandit 7
    tmpDefs['b7']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b7']['fire']['template'] = 'template_fire2';
    tmpDefs['b7']['fire']['x'] = 21;
    tmpDefs['b7']['fire']['y'] = 4;
    tmpDefs['b7']['fire']['timeOffset'] = 500; // ms
    tmpDefs['b7']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 7
    tmpDefs['b7']['die'] = new Array();
    tmpDefs['b7']['die']['elem'] = 'animate';
    tmpDefs['b7']['die']['attr'] = 'y';
    tmpDefs['b7']['die']['dur'] = 550; // ms
    tmpDefs['b7']['die']['by'] = 170;
    tmpDefs['b7']['die']['audio'] = 'ugh2';


/* ************************  INNOCENT BANDIT 7 - 15. TEMPLATE **************************** */
    // badit 7 - 15. template
    tmpDefs['b15'] = new Array();
    tmpDefs['b15']['template'] = 'template_b7i';
    tmpDefs['b15']['points'] = -5;
    tmpDefs['b15']['x1'] = 600;          tmpDefs['b15']['y1'] = 196;
    tmpDefs['b15']['x2'] = 600;          tmpDefs['b15']['y2'] = 196;
    tmpDefs['b15']['BBwidth'] = 21;      tmpDefs['b15']['BBheight'] = 28;
    tmpDefs['b15']['BBkoefX'] = 5;       tmpDefs['b15']['BBkoefY'] = 7;
    tmpDefs['b15']['mask'] = 'mask_b7';

    // appearing animation of bandit 7 - 15
    tmpDefs['b15']['appear'] = new Array();
    tmpDefs['b15']['appear']['elem'] = 'animate';
    tmpDefs['b15']['appear']['attr'] = 'x';
    tmpDefs['b15']['appear']['dur'] = 1000; // ms
    tmpDefs['b15']['appear']['by'] = 26;
    tmpDefs['b15']['appear']['audio'] = 'creak';

    // firing/shooting animation of bandit 7 - 15
    tmpDefs['b15']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b15']['fire']['template'] = 'template_fire2';
    tmpDefs['b15']['fire']['x'] = 21;
    tmpDefs['b15']['fire']['y'] = 4;
    tmpDefs['b15']['fire']['timeOffset'] = 500; // ms
    tmpDefs['b15']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 7 - 15
    tmpDefs['b15']['die'] = new Array();
    tmpDefs['b15']['die']['elem'] = 'animate';
    tmpDefs['b15']['die']['attr'] = 'y';
    tmpDefs['b15']['die']['dur'] = 550; // ms
    tmpDefs['b15']['die']['by'] = 170;
    tmpDefs['b15']['die']['audio'] = 'ugh5';


/* ************************  BANDIT 8. TEMPLATE **************************** */
    // badit 8. template
    tmpDefs['b8'] = new Array();
    tmpDefs['b8']['template'] = 'template_b8';
    tmpDefs['b8']['points'] = 5;
    tmpDefs['b8']['x1'] = 90;           tmpDefs['b8']['y1'] = 450;
    tmpDefs['b8']['x2'] = 490;          tmpDefs['b8']['y2'] = 450;
    tmpDefs['b8']['BBwidth'] = 86;      tmpDefs['b8']['BBheight'] = 250;
    tmpDefs['b8']['BBkoefX'] = -35;     tmpDefs['b8']['BBkoefY'] = 20;
    tmpDefs['b8']['mask'] = 'mask_b3';

    // appearing animation of bandit 8
    tmpDefs['b8']['appear'] = new Array();
    tmpDefs['b8']['appear']['elem'] = 'animate';
    tmpDefs['b8']['appear']['attr'] = 'y';
    tmpDefs['b8']['appear']['dur'] = 1500; // ms
    tmpDefs['b8']['appear']['by'] = -260;
    tmpDefs['b8']['appear']['audio'] = 'haha';

    // firing/shooting animation of bandit 8
    tmpDefs['b8']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b8']['fire']['template'] = 'template_fire4';
    tmpDefs['b8']['fire']['x'] = -20;
    tmpDefs['b8']['fire']['y'] = 60;
    tmpDefs['b8']['fire']['timeOffset'] = 500; // ms
    tmpDefs['b8']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 8
    tmpDefs['b8']['die'] = new Array();
    tmpDefs['b8']['die']['elem'] = 'animate';
    tmpDefs['b8']['die']['attr'] = 'y';
    tmpDefs['b8']['die']['dur'] = 350; // ms
    tmpDefs['b8']['die']['by'] = 200;
    tmpDefs['b8']['die']['audio'] = 'ugh4';



/* ************************  INNOCENT BANDIT 8 - 14. TEMPLATE **************************** */
    // badit 8 - 14. template
    tmpDefs['b14'] = new Array();
    tmpDefs['b14']['template'] = 'template_b8i';
    tmpDefs['b14']['points'] = -5;
    tmpDefs['b14']['x1'] = 90;           tmpDefs['b14']['y1'] = 447;
    tmpDefs['b14']['x2'] = 470;          tmpDefs['b14']['y2'] = 447;
    tmpDefs['b14']['BBwidth'] = 75;      tmpDefs['b14']['BBheight'] = 200;
    tmpDefs['b14']['BBkoefX'] = 128;     tmpDefs['b14']['BBkoefY'] = 90;
    tmpDefs['b14']['mask'] = '';

    // appearing animation of bandit 8 - 14
    tmpDefs['b14']['appear'] = new Array();
    tmpDefs['b14']['appear']['elem'] = 'animate';
    tmpDefs['b14']['appear']['attr'] = 'y';
    tmpDefs['b14']['appear']['dur'] = 1700; // ms
    tmpDefs['b14']['appear']['by'] = -260;
    tmpDefs['b14']['appear']['audio'] = '';

    // firing/shooting animation of bandit 8 - 14
    tmpDefs['b14']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b14']['fire']['template'] = 'template_fire4';
    tmpDefs['b14']['fire']['x'] = -20;
    tmpDefs['b14']['fire']['y'] = 60;
    tmpDefs['b14']['fire']['timeOffset'] = 700; // ms
    tmpDefs['b14']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 8 - 14
    tmpDefs['b14']['die'] = new Array();
    tmpDefs['b14']['die']['elem'] = 'animate';
    tmpDefs['b14']['die']['attr'] = 'y';
    tmpDefs['b14']['die']['dur'] = 350; // ms
    tmpDefs['b14']['die']['by'] = 200;
    tmpDefs['b14']['die']['audio'] = 'innough';



/* ************************  BANDIT 9. TEMPLATE **************************** */
    // badit 9. template
    tmpDefs['b9'] = new Array();
    tmpDefs['b9']['template'] = 'template_b9';
    tmpDefs['b9']['points'] = 3;
    tmpDefs['b9']['x1'] = 450;          tmpDefs['b9']['y1'] = 219;
    tmpDefs['b9']['x2'] = 480;          tmpDefs['b9']['y2'] = 219;
    tmpDefs['b9']['BBwidth'] = 32;      tmpDefs['b9']['BBheight'] = 72;
    tmpDefs['b9']['BBkoefX'] = 4;       tmpDefs['b9']['BBkoefY'] = 24;
    tmpDefs['b9']['mask'] = 'mask_b9';

    // appearing animation of bandit 9
    tmpDefs['b9']['appear'] = new Array();
    tmpDefs['b9']['appear']['elem'] = 'animate';
    tmpDefs['b9']['appear']['attr'] = 'x';
    tmpDefs['b9']['appear']['dur'] = 4000; // ms
    tmpDefs['b9']['appear']['by'] = -150;
    tmpDefs['b9']['appear']['audio'] = '';

    // firing/shooting animation of bandit 9
    tmpDefs['b9']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b9']['fire']['template'] = 'template_fire2';
    tmpDefs['b9']['fire']['x'] = 24;
    tmpDefs['b9']['fire']['y'] = -2;
    tmpDefs['b9']['fire']['timeOffset'] = 100; // ms
    tmpDefs['b9']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 9
    tmpDefs['b9']['die'] = new Array();
    tmpDefs['b9']['die']['elem'] = 'animate';
    tmpDefs['b9']['die']['attr'] = 'y';
    tmpDefs['b9']['die']['dur'] = 500; // ms
    tmpDefs['b9']['die']['by'] = 200;
    tmpDefs['b9']['die']['audio'] = 'ugh3';


/* ************************  BANDIT 11. TEMPLATE **************************** */
    // badit 11. template
    tmpDefs['b11'] = new Array();
    tmpDefs['b11']['template'] = 'template_b11';
    tmpDefs['b11']['points'] = 3;
    tmpDefs['b11']['x1'] = 717;          tmpDefs['b11']['y1'] = 66;    // (-738)
    tmpDefs['b11']['x2'] = 717;          tmpDefs['b11']['y2'] = 66;
    tmpDefs['b11']['BBwidth'] = 32;      tmpDefs['b11']['BBheight'] = 32;
    tmpDefs['b11']['BBkoefX'] = 4;       tmpDefs['b11']['BBkoefY'] = 26;
    tmpDefs['b11']['mask'] = 'mask_b11';

    // appearing animation of bandit 1
    tmpDefs['b11']['appear'] = new Array();
    tmpDefs['b11']['appear']['elem'] = 'animate';
    tmpDefs['b11']['appear']['attr'] = 'y';
    tmpDefs['b11']['appear']['dur'] = 2000; // ms
    tmpDefs['b11']['appear']['by'] = -50;
    tmpDefs['b11']['appear']['audio'] = '';

    // firing/shooting animation of bandit 1
    tmpDefs['b11']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b11']['fire']['template'] = 'template_fire2';
    tmpDefs['b11']['fire']['x'] = 26;
    tmpDefs['b11']['fire']['y'] = 8;
    tmpDefs['b11']['fire']['timeOffset'] = 100; // ms
    tmpDefs['b11']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 1
    tmpDefs['b11']['die'] = new Array();
    tmpDefs['b11']['die']['elem'] = 'animate';
    tmpDefs['b11']['die']['attr'] = 'y';
    tmpDefs['b11']['die']['dur'] = 500; // ms
    tmpDefs['b11']['die']['by'] = 200;
    tmpDefs['b11']['die']['audio'] = 'ugh5';


/* ************************  INNOCENT BANDIT 12 - 11. TEMPLATE **************************** */
    // badit 12 - 11. template
    tmpDefs['b12'] = new Array();
    tmpDefs['b12']['template'] = 'template_b11i';
    tmpDefs['b12']['points'] = -5;
    tmpDefs['b12']['x1'] = 757;          tmpDefs['b12']['y1'] = 72;    // (-738)
    tmpDefs['b12']['x2'] = 757;          tmpDefs['b12']['y2'] = 72;
    tmpDefs['b12']['BBwidth'] = 27;      tmpDefs['b12']['BBheight'] = 43;
    tmpDefs['b12']['BBkoefX'] = -30;       tmpDefs['b12']['BBkoefY'] = 10;
    tmpDefs['b12']['mask'] = 'mask_b11';

    // appearing animation of bandit 12 - 11
    tmpDefs['b12']['appear'] = new Array();
    tmpDefs['b12']['appear']['elem'] = 'animate';
    tmpDefs['b12']['appear']['attr'] = 'y';
    tmpDefs['b12']['appear']['dur'] = 2000; // ms
    tmpDefs['b12']['appear']['by'] = -50;
    tmpDefs['b12']['appear']['audio'] = '';

    // firing/shooting animation of bandit 12 - 11
    tmpDefs['b12']['fire'] = new Array(); // relative to the top-left corner of BB
    tmpDefs['b12']['fire']['template'] = 'template_fire2';
    tmpDefs['b12']['fire']['x'] = 26;
    tmpDefs['b12']['fire']['y'] = 8;
    tmpDefs['b12']['fire']['timeOffset'] = 600; // ms
    tmpDefs['b12']['fire']['audio'] = 'gun_fire_enemy';

    // dying animation of bandit 12 - 11
    tmpDefs['b12']['die'] = new Array();
    tmpDefs['b12']['die']['elem'] = 'animate';
    tmpDefs['b12']['die']['attr'] = 'y';
    tmpDefs['b12']['die']['dur'] = 500; // ms
    tmpDefs['b12']['die']['by'] = 200;
    tmpDefs['b12']['die']['audio'] = 'ugh2';

