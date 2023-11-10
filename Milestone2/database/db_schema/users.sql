CREATE TABLE IF NOT EXISTS `users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100),
  `username` varchar(20) NOT NULL,
  `avatar` TEXT NOT NULL,
  `role` varchar(13) NOT NULL,
  `affiliation` varchar(100) NOT NULL,
  `hourly_rate` DECIMAL,
  `salt` TEXT NOT NULL,
  `password` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `users` (`first_name`, `last_name`, `username`, `avatar`, `role`, `affiliation`, `hourly_rate`, `salt`, `password`) VALUES
  ('Stu','Dent','student','https://robohash.org/veniamdoloresenim.png?size=64x64&set=set1','self-employed','none',12,'95754c9248c8c88425c9c4f2e57efa87','e8147169a152ed06bf84e527791273ee1f7e0c2b50e209fcb339c7838fccb04c17fc714e1b9000a27c0373a720689b9b58b8873a339d1b49d11baa3784ab93f6'),
  ('Gra','Duate','graduate','https://robohash.org/nullaautemin.png?size=64x64&set=set1','employer','Google',40,'7efd4dc9e3b5f1518ee8f8db7dac92e0','6c0db4eb5593f9db23c4b3b71d2f9dd223039fbbd5cd5a5490efb804778be2c47126d0c1ed418eb62938bcda56b9db266f79464593ee1eb7fa3ed04cb4651b1f'),
  ('Vassily','Yeskov','vyeskov2','https://robohash.org/teneturlaborenon.png?size=64x64&set=set1','employee','Google',60,'95e4027849f295618f1514ba490e630d','1ea1dc0c23ea3d22ea292a49a1d181d2439c409a683590fc4a856bbfba9926fa14051b69a071cb183fe30b384f81d7469405fe770ff8f1921b992afe2359b907'),
  ('Freida','Halbert','fhalbert3','https://robohash.org/hicetminus.png?size=64x64&set=set1','employer','Fidelity Investments',25,'a23c276ea42190dbf4a750717338e92a','1690622216f7573591311dee22f82990a45640e16740ad0e0215b5e368a56f19f40bc29bc8d07294b63da5faedc67fe09047107727542e348b030281d170a96d'),
  ('Gloria','Macconaghy','gmacconaghy4','https://robohash.org/teneturevenietfacere.png?size=64x64&set=set1','self-employed','none',12,'b29db944c343fdc383c802133ef5a4bb','7c88a7a7642fe7057757c3f62b31f5b4cbb1e4dbedd2c8460b620b70dcde58016366d52d203e929edb0d3ed5c031d9ef4314048a78410b39c6ca329d3b3bda9e'),
  ('Mariam','Tweede','mtweede5','https://robohash.org/impeditipsaet.png?size=64x64&set=set1','employer','Google',80,'e8bb31b04f1c83feb80d12de62334d3b','97aee340f5d733b3771b3fea10722b3096f1282ed0850a572326d0d7f6238c0f60a6924fe1e66b60d4ebcad8f4254ce26c05003c4b50b696cf5aa3e639377f02'),
  ('Loraine','McDade','lmcdade6','https://robohash.org/illoeamolestiae.png?size=64x64&set=set1','employee','Google',50,'4f931783f4b147e368c992732f994069','5da9da46668ca55c43039d6e62e23d92b775d3e4d4c083539284c9a691ad5378fe03364914afbadd7d6f1bf09a8e24f307e4162b683a363b520797b9445d3db7'),
  ('Doris','Blease','dblease7','https://robohash.org/necessitatibusquisporro.png?size=64x64&set=set1','employer','Fidelity Investments',35,'4918867ed7973fe09205a10a0ffd63cb','8eb617542d4b4272d1790dcc8c1c2fbd0842fca019862e3039e93fcbd7d248e0621ced724cf57e83c9afb5804400ca7f9f7cc07c45960421ad32aa2b0666f57c'),
  ('Johann','Janata','jjanata8','https://robohash.org/quiducimuseaque.png?size=64x64&set=set1','self-employed','none',null,'152a7df9020f20b20759997306eb9f4c','9a37aba55001fd21251e2db7317016589d70c2a6202a85bbca1ef329fd62ca93cd2a380dd2133adcb2e2130266b4960fecc7ec0f2198d491430077cd9c39325d'),
  ('Terrell','Steenson','tsteenson9','https://robohash.org/doloribusetassumenda.png?size=64x64&set=set1','employer','Google',60,'951af48aaba4450ca4537af5a52c0a38','14e8aebcb0967593c9a23a0b2d96745536afc5f548aac378a3d0388fa282f2ad819e4b70de9d064f5659e0e21d56ab05e840c6816f9f37cad69b32d87f4396f5'),
  ('Sutton','Ingry','singrya','https://robohash.org/minimamagnamenim.png?size=64x64&set=set1','employee','Fidelity Investments',25,'972912b0543bf5e37bc2105314acefe9','4bbb370e1be4a642683e261712339d71fbf83287392bb6324a1a995940edbd150520deb327d128e8cd072db3aa96dc3ebc459640f094d1764d9f9d6a79df860e'),
  ('Hazel','Burdas','hburdasb','https://robohash.org/dolorquasunde.png?size=64x64&set=set1','employer','Cisco',40,'c1ca8683e8ecbdf6282c6d3d5ca669b6','2a6d605bfeac3e166df690863496c177dcfccfe7092990a842246dc0847c2a77535096c6ce06f2e2030d2c2a791fe249c7ea695934aacc2794722398cef2afb5'),
  ('Bobbette','Steel','bsteelc','https://robohash.org/consecteturmollitiaut.png?size=64x64&set=set1','self-employed','none',12,'445b1b176b8bc7fc75679d61c59e6c41','a15833031ef5a9be5fc1806250936d6409368270795de6b7c5b5e8e3d98d52f7a2b24fd098b4f37cabdabe327f802424ad3a175e8b371e5da2b5c176596dd4b7'),
  ('Rosa','Ricardot','rricardotd','https://robohash.org/atanimiexcepturi.png?size=64x64&set=set1','employer','McAfee',30,'f1474955a0aa578a37f9f6313777f87b','895fc51fedf261b0d9bcaffbada7fdbaf9b7f1abcc01240dda11a48c7fc7bcf68d42efbcbfd3f73bc800cb0c7be1dff8e2d29fdcaf46e9821fb8dfa62b04d493'),
  ('Estele','Slatford','eslatforde','https://robohash.org/eaaccusantiumlabore.png?size=64x64&set=set1','employee','Google',50,'6015d7c022052130122e0e18f222155d','ac5dce5316af151d3abdcb4aed1231db542a45f775f42508085a70280ed9f37446cc47e42ab1cd14fae7c71181733b977db312ec2770b5a136da6b512d59304b'),
  ('Genni','Brodest','gbrodestf','https://robohash.org/minimamagnamin.png?size=64x64&set=set1','employer','McAfee',24,'1dded1a5368037f1d72e6d33f81b3f92','5c72f4a1ea492b7e9747edaf523944122d02c8178dc59649f1ca98a0c4cf61eccb795ed6e5a279efe05cfd2f7f1b610b8a5d86b01e77a7795cfdd3a65a0926bd'),
  ('Milissent','Lippatt','mlippattg','https://robohash.org/utillumea.png?size=64x64&set=set1','self-employed','none',30,'96da8ca9a1da1a91679b5cde32185188','8ae187b6bca98d1745876bef88559f45b559d48dd7f286f846505a4d55bace7f73c0cf1704e750075fdf77e7183db850f4060eb019fd6963a7281a76302867e1'),
  ('Sondra','Leheude','sleheudeh','https://robohash.org/eaqueeligendiipsam.png?size=64x64&set=set1','employer','Microsoft',60,'c70a14617fafc2f8feb50d9a7968d083','c2d04e3c99d70e01c0d6eb1d8f3a73bc0ad1855083e4d24818ae004a3f539c0aaee91751bc1dacca3cd0f4e23c09f2e8f1b779e27d7324c5ae13fda2ab7ddaba'),
  ('Gwenore','Durnin','gdurnini','https://robohash.org/aliquidnonquo.png?size=64x64&set=set1','employee','Microsoft',50,'2fbc2826aac283596857bb8aee54792a','d2d3f2a80f97147207c29ffb6cfdec43be2b48d5ce8c28e3a149c09492c5cc6d4bf9330db1e2e5b1bf228e0f5600bf7dc8b7954cfb76cba5ce91cbab029a6791'),
  ('Joanne','Mungin','jmunginj','https://robohash.org/voluptatibusabet.png?size=64x64&set=set1','employer','Google',50,'2f562e8c5f144d4fac98e422a409a7bb','aeb4ff6ff06e2516ccefdc1be520d576251a5cb974496a40aa7fddd95349ad7a0f03bee03fda94918ba6851aa33701b48b26ac654b7536f247239f72e77aafa9'),
  ('Andres','Ayliff','aayliffk','https://robohash.org/quoetet.png?size=64x64&set=set1','self-employed','none',13,'eb54f0fe51139df357d0d963a23da3b1','19b0ffa37b6bd191334dc7790da55b2b0c4888cffb3e9e856d56bb000aa260f058cd78f9ffafe610c9ceab009546f52d2e69b3494f8971abf6cbb109b596ca0b'),
  ('Ann-marie','Tremblet','atrembletl','https://robohash.org/ipsamolestiaeat.png?size=64x64&set=set1','employer','Raytheon',12,'e6c1196ce703fb8225beaf7ad662d02d','edddce7ef96e41b1e1112ba17a835e8d3499504bdd638166260c176656705a32bb45d1a2ee12f3ca334b69c50606c96cabd7c4ffe0ed237c2988a586a5fe1515'),
  ('Albina','Mapham','amaphamm','https://robohash.org/eosinciduntquam.png?size=64x64&set=set1','employee','MrBeast',12,'b2ff603e51b099e7707e0445ba4959aa','51fe7c621a7efc52db9c8fca4b087ec408c8ca9c5e9bd487f8b0cd9f20fb61c2f6d7eac629410346e86089ba4977bf8d4093d1f202b66b5e01b872bcb8f3b26c'),
  ('Jimmy','Donaldson','MrBeast','https://robohash.org/praesentiumharumaliquid.png?size=64x64&set=set1','employer','MrBeast',12,'7cb2dfbfc12a4fba26d395b220d2e182','8e3b60f94a447155b97c9154e132a65b6af91c0f45da8305a326273ff6850321cca0e47f34f548a7551a6dcb2f6e7cfe4bcd3651dcb63a852a89e3c22e6f80bc'),
  ('Sterne','Cundey','scundeyo','https://robohash.org/necessitatibusoccaecatifuga.png?size=64x64&set=set1','self-employed','none',12,'522d71c5c89d25cc5ed6549343053ec8','1ebf065c99047324e4e84ef527eecf38c3454e2ed300d60b92d6f903b5742ebaec8e6b5a0dc7b926f273f27f3ad202be01f1b2b0913f2f52e90317c6a6ceb7d8');

-- Create records table
CREATE TABLE IF NOT EXISTS `records` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `minutes` INTEGER NOT NULL,
  `notes` TEXT,
  `paid` BOOLEAN NOT NULL,
  PRIMARY KEY (`id`)
);

-- Create user_records join table 
CREATE TABLE IF NOT EXISTS `user_records` (
  `record_id` INTEGER,
  `user_id` INTEGER,
  FOREIGN KEY (`record_id`) REFERENCES records(`id`),
  FOREIGN KEY (`user_id`) REFERENCES users(`id`)
);

-- Populate records
INSERT INTO `records` (`date`, `minutes`, `notes`, `paid`) VALUES
  ('2023-10-11 09:34:13', 120, 'I worked so hard today', FALSE),
  ('2023-10-11 09:34:13', 50, 'I worked so hard today', FALSE),
  ('2023-10-11 09:34:13', 50, 'I worked so hard today', FALSE),
  ('2023-10-11 09:34:13', 30, 'I worked so hard today', FALSE),
  ('2023-10-11 09:34:13', 20, 'I worked so hard today', FALSE);


-- Populate user_records join table
INSERT INTO `user_records` (`record_id`, `user_id`) VALUES
  (1,1),
  (2,2),
  (3,3),
  (4,4),
  (5,5); 

-- Create payments table
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT, 
  `date` DATE NOT NULL,
  `sender_id` INTEGER NOT NULL,
  `recipient_id` INTEGER NOT NULL,
  `amount` NUMERIC NOT NULL
);

-- Create records_payments join table
CREATE TABLE IF NOT EXISTS `records_payments` (
  `record_id` INTEGER,
  `payment_id` INTEGER,
  FOREIGN KEY (`record_id`) REFERENCES records(`id`),
  FOREIGN KEY (`payment_id`) REFERENCES payments(`id`)  
);


-- Populate payments
INSERT INTO `payments` (`date`, `sender_id`, `recipient_id`, `amount`) VALUES
  ('2023-10-11 09:34:13', 1, 2, 120),
  ('2023-10-11 09:34:13', 1, 3, 5),
  ('2023-10-11 09:34:13', 2, 3, 12),
  ('2023-10-11 09:34:13', 5, 1, 19.99),
  ('2023-10-11 09:34:13', 3, 4, 0.5);
  

-- Populate records_payments (sample data) 
INSERT INTO `records_payments` (`record_id`, `payment_id`) VALUES
  (1,1),
  (2,2),
  (3,3);