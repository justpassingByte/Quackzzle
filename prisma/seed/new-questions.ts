import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Bộ câu hỏi D - Khoa học và Công nghệ
  const scienceQuestions = [
    {
      content: "Công nghệ nào cho phép thiết bị điện tử giao tiếp không dây trong phạm vi ngắn?",
      options: ["Wi-Fi", "Bluetooth", "5G", "NFC"],
      correctAnswer: "NFC",
      category: "Technology",
      createdBy: "admin",
      questionSet: "D",
      answerExplanation: "NFC (Near Field Communication) là công nghệ cho phép thiết bị điện tử giao tiếp không dây trong phạm vi rất ngắn, thường dưới 4cm. Khác với Wi-Fi hoặc Bluetooth có phạm vi xa hơn, NFC thường được sử dụng cho thanh toán không tiếp xúc, thẻ truy cập, và chia sẻ dữ liệu nhanh giữa các thiết bị gần nhau.",
    },
    {
      content: "Ngôn ngữ lập trình nào được sử dụng phổ biến nhất để phát triển ứng dụng iOS?",
      options: ["Java", "Kotlin", "Swift", "C#"],
      correctAnswer: "Swift",
      category: "Technology",
      createdBy: "admin",
      questionSet: "D",
      answerExplanation: "Swift là ngôn ngữ lập trình được Apple phát triển đặc biệt cho hệ sinh thái iOS. Được giới thiệu vào năm 2014, Swift đã thay thế Objective-C để trở thành ngôn ngữ chính thức cho việc phát triển ứng dụng trên iOS, iPadOS, macOS, watchOS và tvOS."
    },
    {
      content: "Thuật ngữ 'Machine Learning' thuộc lĩnh vực nào?",
      options: ["Trí tuệ nhân tạo", "Thiết kế đồ họa", "An ninh mạng", "Phát triển web"],
      correctAnswer: "Trí tuệ nhân tạo",
      category: "Technology",
      createdBy: "admin",
      questionSet: "D",
      image: "https://i.imgur.com/VdbTcG5.jpg",
      answerExplanation: "Machine Learning (Học máy) là một nhánh của Trí tuệ nhân tạo (AI). Nó tập trung vào việc phát triển các thuật toán và mô hình cho phép máy tính học từ dữ liệu và đưa ra dự đoán hoặc quyết định mà không cần được lập trình cụ thể cho nhiệm vụ đó."
    },
    {
      content: "Người được coi là cha đẻ của trí tuệ nhân tạo (AI) là ai?",
      options: ["Alan Turing", "Bill Gates", "Tim Berners-Lee", "Steve Jobs"],
      correctAnswer: "Alan Turing",
      category: "Technology",
      createdBy: "admin",
      questionSet: "D",
      answerExplanation: "Alan Turing được coi là cha đẻ của trí tuệ nhân tạo vì những đóng góp nền tảng của ông trong lĩnh vực khoa học máy tính. Ông đã đề xuất 'Turing Test' năm 1950, một tiêu chuẩn để xác định liệu một máy có thể suy nghĩ được hay không. Các nghiên cứu của ông đã đặt nền móng cho việc phát triển AI hiện đại."
    },
    {
      content: "Hiện tượng vật lý nào được sử dụng trong ổ cứng SSD?",
      options: ["Từ tính", "Quang học", "Điện tử", "Âm thanh"],
      correctAnswer: "Điện tử",
      category: "Technology",
      createdBy: "admin",
      questionSet: "D",
      answerExplanation: "Ổ cứng SSD (Solid State Drive) sử dụng các chip nhớ flash NAND dựa trên nguyên lý điện tử để lưu trữ dữ liệu. Khác với ổ cứng HDD truyền thống sử dụng nguyên lý từ tính với các đĩa quay, SSD không có bộ phận chuyển động cơ học nên nhanh hơn, tiêu thụ ít năng lượng hơn và bền hơn."
    },
  ]

  // Bộ câu hỏi E - Nghệ thuật và Giải trí
  const artQuestions = [
    {
      content: "Bức tranh nổi tiếng 'Starry Night' là tác phẩm của họa sĩ nào?",
      options: ["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Claude Monet"],
      correctAnswer: "Vincent van Gogh",
      category: "Art",
      createdBy: "admin",
      questionSet: "E",
      image: "https://i.imgur.com/LMtmKCF.jpg",
      answerExplanation: "'Starry Night' (Đêm đầy sao) là một trong những tác phẩm nổi tiếng nhất của Vincent van Gogh, được sáng tác vào năm 1889. Bức tranh thể hiện khung cảnh đêm đầy sao từ cửa sổ phòng của Van Gogh tại bệnh viện tâm thần Saint-Paul-de-Mausole ở Saint-Rémy-de-Provence, Pháp, nơi ông điều trị bệnh tâm thần."
    },
    {
      content: "Phim nào đoạt giải Oscar cho Phim hay nhất năm 2023?",
      options: ["Everything Everywhere All at Once", "Avatar: The Way of Water", "Top Gun: Maverick", "The Banshees of Inisherin"],
      correctAnswer: "Everything Everywhere All at Once",
      category: "Entertainment",
      createdBy: "admin",
      questionSet: "E",
      answerExplanation: "'Everything Everywhere All at Once' đã giành giải Oscar cho Phim hay nhất năm 2023, cùng với nhiều giải khác như Đạo diễn xuất sắc, Nữ diễn viên chính xuất sắc (Michelle Yeoh), Nữ diễn viên phụ xuất sắc (Jamie Lee Curtis), Nam diễn viên phụ xuất sắc (Ke Huy Quan), và Kịch bản gốc xuất sắc nhất."
    },
    {
      content: "Nhạc cụ nào có 88 phím?",
      options: ["Guitar", "Violin", "Piano", "Saxophone"],
      correctAnswer: "Piano",
      category: "Music",
      createdBy: "admin",
      questionSet: "E",
      image: "https://i.imgur.com/F1ZeRGR.jpg",
      answerExplanation: "Piano tiêu chuẩn có 88 phím, bao gồm 52 phím trắng (các nốt tự nhiên: C, D, E, F, G, A, B) và 36 phím đen (các nốt thăng và giáng). Phạm vi âm thanh trải dài từ A0 (thấp nhất) đến C8 (cao nhất), cho phép người chơi biểu diễn nhiều loại nhạc từ cổ điển đến hiện đại."
    },
    {
      content: "Ai là tác giả của bộ truyện 'Harry Potter'?",
      options: ["Stephen King", "J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin"],
      correctAnswer: "J.K. Rowling",
      category: "Literature",
      createdBy: "admin",
      questionSet: "E",
      answerExplanation: "J.K. Rowling (tên đầy đủ là Joanne Rowling) là tác giả của bộ truyện Harry Potter gồm 7 tập, xuất bản từ năm 1997 đến 2007. Bộ truyện đã trở thành hiện tượng văn hóa toàn cầu, được dịch ra hơn 80 ngôn ngữ và bán hơn 500 triệu bản trên toàn thế giới."
    },
    {
      content: "Loại nhạc cụ nào sau đây thuộc họ dây?",
      options: ["Trống", "Kèn", "Đàn violon", "Sáo"],
      correctAnswer: "Đàn violon",
      category: "Music",
      createdBy: "admin",
      questionSet: "E",
      answerExplanation: "Đàn violon (violin) là nhạc cụ thuộc họ dây - nhóm nhạc cụ phát ra âm thanh bằng cách rung dây. Violin có 4 dây (G, D, A, E) và được chơi bằng cách kéo cung qua các dây hoặc búng dây (pizzicato). Nó là nhạc cụ có âm vực cao nhất trong gia đình vĩ cầm, bao gồm viola, cello và double bass."
    },
  ]

  // Bộ câu hỏi F - Thể thao
  const sportsQuestions = [
    {
      content: "Cầu thủ nào đã giành được nhiều Quả Bóng Vàng nhất trong lịch sử bóng đá?",
      options: ["Cristiano Ronaldo", "Lionel Messi", "Pelé", "Diego Maradona"],
      correctAnswer: "Lionel Messi",
      category: "Sports",
      createdBy: "admin",
      questionSet: "F",
      image: "https://i.imgur.com/6q97OEo.jpg",
      answerExplanation: "Lionel Messi đã giành được 8 Quả Bóng Vàng (2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023), nhiều hơn bất kỳ cầu thủ nào trong lịch sử. Cristiano Ronaldo đứng thứ hai với 5 lần đoạt giải. Quả Bóng Vàng được trao bởi tạp chí France Football là giải thưởng cá nhân danh giá nhất trong bóng đá thế giới."
    },
    {
      content: "Môn thể thao nào có sử dụng thuật ngữ 'Birdie', 'Eagle' và 'Bogey'?",
      options: ["Tennis", "Golf", "Cricket", "Bóng đá"],
      correctAnswer: "Golf",
      category: "Sports",
      createdBy: "admin",
      questionSet: "F",
      answerExplanation: "Trong golf, 'Birdie' nghĩa là hoàn thành một hố với số gậy ít hơn par (số chuẩn) 1 gậy. 'Eagle' là hoàn thành với số gậy ít hơn par 2 gậy. 'Bogey' là hoàn thành với số gậy nhiều hơn par 1 gậy. Par là số gậy tiêu chuẩn mà một golf thủ giỏi cần để hoàn thành một hố, thường là 3, 4 hoặc 5 gậy tùy theo độ dài của hố."
    },
    {
      content: "Giải Grand Slam trong quần vợt có bao nhiêu giải đấu chính?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
      category: "Sports",
      createdBy: "admin",
      questionSet: "F",
      answerExplanation: "Giải Grand Slam trong quần vợt bao gồm 4 giải đấu chính: Australian Open (tháng 1), Roland Garros/French Open (tháng 5-6), Wimbledon (tháng 6-7), và US Open (tháng 8-9). Mỗi giải đấu được tổ chức trên một mặt sân khác nhau: Australian Open và US Open trên sân cứng, Roland Garros trên sân đất nện, và Wimbledon trên sân cỏ."
    },
    {
      content: "Cầu thủ bóng rổ Michael Jordan nổi tiếng với số áo nào?",
      options: ["8", "23", "24", "33"],
      correctAnswer: "23",
      category: "Sports",
      createdBy: "admin",
      questionSet: "F",
      image: "https://i.imgur.com/I2NuHFZ.jpg",
      answerExplanation: "Michael Jordan nổi tiếng với số áo 23 trong thời gian thi đấu cho Chicago Bulls, nơi ông giành được 6 chức vô địch NBA. Số áo 23 của Jordan đã trở thành một biểu tượng trong bóng rổ và đã được Chicago Bulls và sau này là Washington Wizards ngưng sử dụng để vinh danh sự nghiệp vĩ đại của ông."
    },
    {
      content: "Thế vận hội Olympic được tổ chức sau bao nhiêu năm một lần?",
      options: ["2 năm", "3 năm", "4 năm", "5 năm"],
      correctAnswer: "4 năm",
      category: "Sports",
      createdBy: "admin",
      questionSet: "F",
      answerExplanation: "Thế vận hội Olympic được tổ chức 4 năm một lần. Truyền thống này đã được duy trì từ khi Thế vận hội hiện đại đầu tiên được tổ chức vào năm 1896 tại Athens, Hy Lạp, mặc dù đã có một số lần gián đoạn do chiến tranh thế giới. Bắt đầu từ năm 1994, Thế vận hội mùa đông và mùa hè đã được tổ chức xen kẽ, mỗi loại 4 năm một lần."
    },
  ]

  // Bộ câu hỏi G - Đời sống và Sức khỏe
  const lifestyleQuestions = [
    {
      content: "Loại vitamin nào được cơ thể tạo ra khi tiếp xúc với ánh nắng mặt trời?",
      options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
      correctAnswer: "Vitamin D",
      category: "Health",
      createdBy: "admin",
      questionSet: "G",
      answerExplanation: "Vitamin D được cơ thể tạo ra khi da tiếp xúc với tia cực tím (UV) từ ánh nắng mặt trời. Quá trình này xảy ra khi tia UV-B chuyển đổi 7-dehydrocholesterol trong da thành previtamin D3, sau đó chuyển thành vitamin D3. Vitamin D rất quan trọng cho sức khỏe xương, hỗ trợ hệ miễn dịch và nhiều chức năng khác của cơ thể."
    },
    {
      content: "Chế độ ăn nào không bao gồm bất kỳ sản phẩm động vật nào?",
      options: ["Paleo", "Keto", "Vegan", "Mediterranean"],
      correctAnswer: "Vegan",
      category: "Lifestyle",
      createdBy: "admin",
      questionSet: "G",
      image: "https://i.imgur.com/JMCBZ8e.jpg",
      answerExplanation: "Chế độ ăn vegan loại bỏ hoàn toàn mọi sản phẩm có nguồn gốc động vật, bao gồm thịt, cá, trứng, sữa và mật ong. Người theo chế độ ăn vegan chỉ tiêu thụ thực phẩm có nguồn gốc thực vật như rau, củ, quả, ngũ cốc, đậu, hạt và các sản phẩm thay thế có nguồn gốc thực vật."
    },
    {
      content: "Bộ phận nào của cơ thể chứa nhiều vi khuẩn nhất?",
      options: ["Da", "Ruột", "Miệng", "Tóc"],
      correctAnswer: "Ruột",
      category: "Health",
      createdBy: "admin",
      questionSet: "G",
      answerExplanation: "Ruột, đặc biệt là ruột già, chứa số lượng vi khuẩn nhiều nhất trong cơ thể con người. Hệ vi sinh vật đường ruột (gut microbiome) bao gồm khoảng 100 nghìn tỷ vi khuẩn thuộc hơn 1000 loài khác nhau. Những vi khuẩn này đóng vai trò quan trọng trong tiêu hóa, hỗ trợ hệ miễn dịch, và tổng hợp các vitamin thiết yếu."
    },
    {
      content: "Phong cách thiết kế nội thất nào tập trung vào sự tối giản và chức năng?",
      options: ["Baroque", "Victorian", "Minimalist", "Art Deco"],
      correctAnswer: "Minimalist",
      category: "Lifestyle",
      createdBy: "admin",
      questionSet: "G",
      image: "https://i.imgur.com/D1PPVFE.jpg",
      answerExplanation: "Phong cách thiết kế Minimalist (Tối giản) tập trung vào 'less is more' - ít hơn là nhiều hơn. Phong cách này đặc trưng bởi không gian thoáng đãng, đồ nội thất đơn giản có tính chức năng cao, bảng màu trung tính, và loại bỏ các yếu tố trang trí không cần thiết. Mục tiêu của phong cách tối giản là tạo ra không gian sống yên bình, gọn gàng và không rối mắt."
    },
    {
      content: "Tập thể dục aerobic chủ yếu tập trung vào cải thiện điều gì?",
      options: ["Sức mạnh cơ bắp", "Hệ tim mạch", "Sự linh hoạt", "Cân bằng"],
      correctAnswer: "Hệ tim mạch",
      category: "Health",
      createdBy: "admin",
      questionSet: "G",
      answerExplanation: "Tập thể dục aerobic (còn gọi là cardio) chủ yếu tập trung vào cải thiện hệ tim mạch. Các bài tập này làm tăng nhịp tim và hô hấp trong thời gian dài, giúp tăng cường sức khỏe tim, cải thiện lưu thông máu, và tăng khả năng hấp thụ oxy của cơ thể. Ví dụ về tập thể dục aerobic bao gồm chạy bộ, đạp xe, bơi lội và nhảy aerobic."
    },
  ]

  // Bộ câu hỏi H - Câu hỏi Video
  const videoQuestions = [
    {
      content: "Loài động vật nào sau đây có thể nhảy cao nhất?",
      options: ["Sư tử", "Báo", "Impala", "Kangaroo"],
      correctAnswer: "Impala",
      category: "Nature",
      createdBy: "admin",
      questionSet: "H",
      videoUrl: "https://www.youtube.com/embed/eMnzc0pRYMo",
      answerExplanation: "Impala là loài linh dương châu Phi có khả năng nhảy cao đáng kinh ngạc. Chúng có thể nhảy lên cao tới 3 mét (khoảng 10 feet) và nhảy xa tới 10 mét (33 feet). Khả năng nhảy phi thường này giúp chúng thoát khỏi kẻ săn mồi và vượt qua các chướng ngại vật trong môi trường sống tự nhiên."
    },
    {
      content: "Thành phố nào là kinh đô của nước Pháp?",
      options: ["Lyon", "Marseille", "Paris", "Nice"],
      correctAnswer: "Paris",
      category: "Geography",
      createdBy: "admin",
      questionSet: "H",
      videoUrl: "https://www.youtube.com/embed/AQ6GmpMu5L8",
      answerExplanation: "Paris là thủ đô và thành phố lớn nhất của Pháp, nằm bên bờ sông Seine. Thành phố có lịch sử phong phú trên 2000 năm, là trung tâm toàn cầu về nghệ thuật, thời trang, ẩm thực và văn hóa. Paris nổi tiếng với các biểu tượng như tháp Eiffel, Nhà thờ Đức Bà Paris, và Bảo tàng Louvre - nơi trưng bày kiệt tác Mona Lisa."
    },
    {
      content: "Loại nhạc cụ nào được thể hiện trong video?",
      options: ["Đàn piano", "Đàn guitar", "Đàn violin", "Đàn saxophone"],
      correctAnswer: "Đàn piano",
      category: "Music",
      createdBy: "admin",
      questionSet: "H",
      videoUrl: "https://www.youtube.com/embed/KJBOm3Zebgs",
      answerExplanation: "Đàn piano là nhạc cụ phím có dây, phát ra âm thanh khi các búa nhỏ bên trong đàn đánh vào dây thép khi người chơi nhấn phím. Piano hiện đại được Bartolomeo Cristofori phát minh vào đầu những năm 1700 ở Ý, và đã trở thành một trong những nhạc cụ phổ biến nhất thế giới, được sử dụng trong nhiều thể loại âm nhạc từ cổ điển đến jazz và pop."
    },
    {
      content: "Loài hoa nào nở dưới mặt nước?",
      options: ["Hoa sen", "Hoa súng", "Hoa hồng", "Hoa lan"],
      correctAnswer: "Hoa súng",
      category: "Nature",
      createdBy: "admin",
      questionSet: "H",
      videoUrl: "https://www.youtube.com/embed/8sVTbJZ6GS0",
      answerExplanation: "Hoa súng (Water lily) là loài thực vật thủy sinh có hoa nổi trên mặt nước và lá nổi hoặc chìm dưới nước. Thân và rễ của chúng bám vào đáy ao hoặc hồ. Hoa súng là biểu tượng văn hóa quan trọng ở nhiều quốc gia và thường được trồng làm cảnh trong các ao vườn, hồ nước do vẻ đẹp của chúng."
    },
    {
      content: "Loại bánh này có tên gọi là gì?",
      options: ["Bánh crepe", "Bánh pancake", "Bánh waffle", "Bánh croissant"],
      correctAnswer: "Bánh crepe",
      category: "Food",
      createdBy: "admin",
      questionSet: "H",
      videoUrl: "https://www.youtube.com/embed/q0-9GEYAIBw",
      answerExplanation: "Bánh crepe là một loại bánh mỏng có nguồn gốc từ vùng Brittany, Pháp. Khác với pancake dày hơn, crepe được làm từ bột lỏng đổ mỏng trên chảo nóng và có thể được phục vụ với nhân mặn hoặc ngọt. Crepe ngọt thường được phủ các loại mứt, chocolate, trái cây, hoặc kem, trong khi crepe mặn (galettes) thường có nhân phô mai, trứng, hoặc thịt."
    },
  ]

  // Bộ câu hỏi A - Lịch sử Việt Nam (1945 đến nay)
  const vietnamHistoryQuestions = [
    {
      content: "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa vào ngày tháng năm nào?",
      options: ["2/9/1945", "10/10/1945", "19/8/1945", "30/4/1975"],
      correctAnswer: "2/9/1945",
      category: "History",
      createdBy: "admin",
      questionSet: "A",
      image: "https://i.imgur.com/HiQ6xVf.jpg",
      answerExplanation: "Ngày 2/9/1945, tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh đã đọc bản Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa (nay là nước Cộng hòa Xã hội Chủ nghĩa Việt Nam). Sự kiện này đánh dấu sự kết thúc của gần một thế kỷ Pháp đô hộ và mở ra kỷ nguyên mới trong lịch sử dân tộc Việt Nam."
    },
    {
      content: "Chiến thắng nào đã chấm dứt sự can thiệp của Pháp ở Việt Nam vào năm 1954?",
      options: ["Chiến thắng Điện Biên Phủ", "Chiến thắng Đồng Khởi", "Chiến thắng Ấp Bắc", "Chiến thắng Hòa Bình"],
      correctAnswer: "Chiến thắng Điện Biên Phủ",
      category: "History",
      createdBy: "admin",
      questionSet: "A",
      image: "https://i.imgur.com/tPZzuF1.jpg",
      answerExplanation: "Chiến thắng Điện Biên Phủ diễn ra từ 13/3/1954 đến 7/5/1954 đã chấm dứt sự can thiệp của Pháp ở Việt Nam. Dưới sự chỉ huy của Đại tướng Võ Nguyên Giáp, quân đội Việt Minh đã đánh bại lực lượng quân sự Pháp tại Điện Biên Phủ, buộc Pháp phải ký Hiệp định Geneva (20/7/1954) công nhận độc lập, chủ quyền của Việt Nam và rút quân khỏi Đông Dương."
    },
    {
      content: "Hiệp định Paris được ký kết vào năm nào, đánh dấu việc Hoa Kỳ rút quân khỏi miền Nam Việt Nam?",
      options: ["1968", "1972", "1973", "1975"],
      correctAnswer: "1973",
      category: "History",
      createdBy: "admin",
      questionSet: "A",
      answerExplanation: "Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được ký kết ngày 27/1/1973 giữa bốn bên: Việt Nam Dân chủ Cộng hòa, Mặt trận Dân tộc Giải phóng miền Nam Việt Nam, Việt Nam Cộng hòa và Hoa Kỳ. Hiệp định này buộc Mỹ phải rút hết quân đội khỏi miền Nam Việt Nam, mở đường cho sự thống nhất đất nước vào năm 1975."
    },
    {
      content: "Ngày 30/4/1975 đánh dấu sự kiện lịch sử nào trong lịch sử Việt Nam hiện đại?",
      options: ["Hiệp định Paris được ký kết", "Giải phóng miền Nam, thống nhất đất nước", "Đại thắng Điện Biên Phủ", "Cách mạng Tháng Tám thành công"],
      correctAnswer: "Giải phóng miền Nam, thống nhất đất nước",
      category: "History",
      createdBy: "admin",
      questionSet: "A",
      image: "https://i.imgur.com/g9KLZnM.jpg",
      answerExplanation: "Ngày 30/4/1975 là ngày Giải phóng miền Nam, thống nhất đất nước Việt Nam. Vào ngày này, quân Giải phóng đã tiến vào Sài Gòn, kéo cờ tại Dinh Độc Lập (nay là Dinh Thống Nhất), đánh dấu sự kết thúc của cuộc kháng chiến chống Mỹ kéo dài hơn 20 năm và mở ra kỷ nguyên mới - kỷ nguyên độc lập, thống nhất và xây dựng đất nước."
    },
    {
      content: "Tên chính thức của Việt Nam hiện nay là gì?",
      options: ["Cộng hòa Dân chủ Việt Nam", "Cộng hòa Nhân dân Việt Nam", "Việt Nam Dân chủ Cộng hòa", "Cộng hòa Xã hội Chủ nghĩa Việt Nam"],
      correctAnswer: "Cộng hòa Xã hội Chủ nghĩa Việt Nam",
      category: "History",
      createdBy: "admin",
      questionSet: "A",
      answerExplanation: "Tên chính thức của Việt Nam hiện nay là Cộng hòa Xã hội Chủ nghĩa Việt Nam, được chính thức sử dụng từ sau khi đất nước thống nhất vào năm 1976. Trước đó, miền Bắc sử dụng tên gọi Việt Nam Dân chủ Cộng hòa (1945-1976), còn miền Nam dưới chế độ Sài Gòn sử dụng tên gọi Việt Nam Cộng hòa (1955-1975)."
    },
    {
      content: "Đại hội Đảng Cộng sản Việt Nam lần thứ VI (1986) đã đề ra chính sách gì quan trọng cho sự phát triển kinh tế?",
      options: ["Chính sách Tập thể hóa", "Chính sách Công nghiệp hóa", "Chính sách Đổi mới (Đổi Mới)", "Chính sách Nhà nước Bao cấp"],
      correctAnswer: "Chính sách Đổi mới (Đổi Mới)",
      category: "History",
      createdBy: "admin",
      questionSet: "A",
      answerExplanation: "Tại Đại hội Đảng Cộng sản Việt Nam lần thứ VI tháng 12/1986, chính sách Đổi mới (Đổi Mới) đã được đề ra, đánh dấu bước ngoặt quan trọng trong lịch sử phát triển của Việt Nam. Chính sách này chuyển đổi nền kinh tế từ mô hình kế hoạch hóa tập trung sang nền kinh tế thị trường định hướng xã hội chủ nghĩa, mở cửa hội nhập quốc tế, thúc đẩy sự phát triển kinh tế-xã hội của đất nước."
    },
    {
      content: "Việt Nam gia nhập tổ chức ASEAN vào năm nào?",
      options: ["1967", "1976", "1985", "1995"],
      correctAnswer: "1995",
      category: "History",
      createdBy: "admin",
      questionSet: "A",
      answerExplanation: "Việt Nam chính thức trở thành thành viên thứ 7 của Hiệp hội các quốc gia Đông Nam Á (ASEAN) vào ngày 28/7/1995. Việc gia nhập ASEAN đánh dấu bước tiến quan trọng trong chính sách đối ngoại của Việt Nam, thể hiện chủ trương đa phương hóa, đa dạng hóa quan hệ quốc tế và hội nhập khu vực, quốc tế sau thời kỳ bị cô lập."
    },
    {
      content: "Chiến dịch Hồ Chí Minh diễn ra vào thời gian nào?",
      options: ["Tháng 4-5/1975", "Tháng 1-2/1968", "Tháng 3-4/1972", "Tháng 12/1974 - 1/1975"],
      correctAnswer: "Tháng 4-5/1975",
      category: "History",
      createdBy: "admin",
      questionSet: "A",
      answerExplanation: "Chiến dịch Hồ Chí Minh diễn ra từ ngày 26/4 đến 30/4/1975, là chiến dịch quân sự cuối cùng của cuộc kháng chiến chống Mỹ. Chiến dịch này do Đại tướng Văn Tiến Dũng chỉ huy, nhằm giải phóng Sài Gòn - trung tâm đầu não của chính quyền Việt Nam Cộng hòa, đánh dấu thắng lợi hoàn toàn của cuộc kháng chiến và mở ra kỷ nguyên thống nhất đất nước."
    },
    {
      content: "Ai là vị Tổng Bí thư đầu tiên của Đảng Cộng sản Việt Nam (tiền thân là Đảng Cộng sản Đông Dương) khi mới thành lập?",
      options: ["Nguyễn Ái Quốc", "Trần Phú", "Lê Duẩn", "Lê Hồng Phong"],
      correctAnswer: "Trần Phú",
      category: "History",
      createdBy: "admin",
      questionSet: "A",
      answerExplanation: "Trần Phú (1904-1931) là Tổng Bí thư đầu tiên của Đảng Cộng sản Đông Dương (nay là Đảng Cộng sản Việt Nam) khi Ban Chấp hành Trung ương chính thức được thành lập tại Hội nghị lần thứ nhất (10/1930). Ông đã soạn thảo Luận cương chính trị đầu tiên của Đảng và đã hy sinh vào ngày 6/9/1931 sau khi bị thực dân Pháp bắt và tra tấn dã man."
    },
    {
      content: "Việt Nam gia nhập Tổ chức Thương mại Thế giới (WTO) vào năm nào?",
      options: ["2000", "2003", "2007", "2010"],
      correctAnswer: "2007",
      category: "History",
      createdBy: "admin",
      questionSet: "A",
      answerExplanation: "Việt Nam chính thức trở thành thành viên thứ 150 của Tổ chức Thương mại Thế giới (WTO) vào ngày 11/1/2007 sau 11 năm đàm phán. Việc gia nhập WTO đánh dấu bước ngoặt quan trọng trong tiến trình hội nhập kinh tế quốc tế của Việt Nam, mở ra cơ hội mới cho phát triển thương mại, đầu tư và thúc đẩy cải cách kinh tế trong nước."
    }
  ]

  // Insert dữ liệu vào cơ sở dữ liệu
  console.log('Bắt đầu tạo bộ câu hỏi mới...')
  
  for (const question of [...scienceQuestions, ...artQuestions, ...sportsQuestions, ...lifestyleQuestions, ...videoQuestions, ...vietnamHistoryQuestions]) {
    await prisma.question.create({
      data: question
    })
  }

  console.log('Đã tạo thành công các bộ câu hỏi mới!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 