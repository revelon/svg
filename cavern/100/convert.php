<?php

  $sounds = Array();
  $sounds["a_missile"] = "28917__junggle__btn107";
  $sounds["a_enemy"] = "51464__smcameron__bombexplosion";
  $sounds["a_bonus"] = "33244__ljudman__dingding";
  $sounds["a_crash"] = "73005__Benboncan__Blast";
  $sounds["a_alarm2"] = "39514__Syna_Max__alarm_of_d00m";
  $sounds["a_alarm"] = "usr_shield_med";
  $sounds["a_forceshield"] = "gravitation_segmental-min";
  $sounds["a_bomb"] = "5382__Jovica__Attack_Zound_02";
  $sounds["a_points"] = "bon_shield_min";
  $sounds["a_positiveShot"] = "3380__patchen__Rhino_05";
  $sounds["a_nothing"] = "4270__NoiseCollector__Chug";
  $sounds["a_crash2"] = "30935__aust_paul__possiblelazer";
  $sounds["a_positiveSound"] = "5211__fonogeno__drop02";
  $sounds["a_level"] = "4269__NoiseCollector__Ghammer";
  $sounds["a_crash3"] = "9628__NoiseCollector__PowerSnareVerb";
  $sounds["a_crash4"] = "49513__Jon285__405Win";
  $sounds["a_startx"] = "min_more_moves";
  $sounds["a_thrust"] = "5446__Jovica__Attack_Zound_69m";
  $sounds["a_gong"] = "hero_available_2min";
  $sounds["a_timeshift"] = "8611__hanstimm__tune606467712448";
  $sounds["a_music"] = "anxmin";

foreach ($sounds as $k => $v) {
  echo '  <audio id="'.$k.'" src="data:audio/ogg;base64,' . base64_encode(file_get_contents("./sounds/" . $v . ".ogg")) . '"/>' . "\n";
}
