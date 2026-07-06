using Microsoft.EntityFrameworkCore;
using Panorama.Api.Data;
using Panorama.Api.Models;

namespace Panorama.Api.Services;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider, IConfiguration config)
    {
        using var scope = serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await db.Database.MigrateAsync();

        // Dynamically add RefreshToken columns if they don't exist (mitigating EF CLI version mismatches)
        if (db.Database.IsSqlite())
        {
            try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"Users\" ADD COLUMN \"RefreshToken\" TEXT NULL;"); } catch {}
            try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"Users\" ADD COLUMN \"RefreshTokenExpiryTime\" TEXT NULL;"); } catch {}
        }
        else
        {
            try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"Users\" ADD COLUMN IF NOT EXISTS \"RefreshToken\" character varying(200) NULL;"); } catch {}
            try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"Users\" ADD COLUMN IF NOT EXISTS \"RefreshTokenExpiryTime\" timestamp with time zone NULL;"); } catch {}
        }

        // Seed Admin User
        if (!await db.Users.AnyAsync())
        {
            var admin = new User
            {
                Username = config["DefaultAdmin:Username"] ?? "admin",
                Email = config["DefaultAdmin:Email"] ?? "admin@panorama.az",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(config["DefaultAdmin:Password"] ?? "Admin123!"),
                Role = "Admin",
                FullName = "Administrator"
            };
            db.Users.Add(admin);
            await db.SaveChangesAsync();
        }

        // Seed Categories
        if (!await db.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new()
                {
                    Slug = "siyaset", Color = "#E63946", SortOrder = 1,
                    Translations = new List<CategoryTranslation>
                    {
                        new() { Language = "az", Name = "Siyasət", Description = "Siyasi xəbərlər və analitika" },
                        new() { Language = "en", Name = "Politics", Description = "Political news and analysis" },
                        new() { Language = "ru", Name = "Политика", Description = "Политические новости и аналитика" }
                    }
                },
                new()
                {
                    Slug = "iqtisadiyyat", Color = "#2A9D8F", SortOrder = 2,
                    Translations = new List<CategoryTranslation>
                    {
                        new() { Language = "az", Name = "İqtisadiyyat", Description = "İqtisadi xəbərlər" },
                        new() { Language = "en", Name = "Economy", Description = "Economic news" },
                        new() { Language = "ru", Name = "Экономика", Description = "Экономические новости" }
                    }
                },
                new()
                {
                    Slug = "dunya", Color = "#1D3557", SortOrder = 3,
                    Translations = new List<CategoryTranslation>
                    {
                        new() { Language = "az", Name = "Dünya", Description = "Dünya xəbərləri" },
                        new() { Language = "en", Name = "World", Description = "World news" },
                        new() { Language = "ru", Name = "Мир", Description = "Мировые новости" }
                    }
                },
                new()
                {
                    Slug = "idman", Color = "#E76F51", SortOrder = 4,
                    Translations = new List<CategoryTranslation>
                    {
                        new() { Language = "az", Name = "İdman", Description = "İdman xəbərləri" },
                        new() { Language = "en", Name = "Sports", Description = "Sports news" },
                        new() { Language = "ru", Name = "Спорт", Description = "Спортивные новости" }
                    }
                },
                new()
                {
                    Slug = "texnologiya", Color = "#457B9D", SortOrder = 5,
                    Translations = new List<CategoryTranslation>
                    {
                        new() { Language = "az", Name = "Texnologiya", Description = "Texnologiya xəbərləri" },
                        new() { Language = "en", Name = "Technology", Description = "Technology news" },
                        new() { Language = "ru", Name = "Технологии", Description = "Технологические новости" }
                    }
                },
                new()
                {
                    Slug = "medeniyyet", Color = "#9B59B6", SortOrder = 6,
                    Translations = new List<CategoryTranslation>
                    {
                        new() { Language = "az", Name = "Mədəniyyət", Description = "Mədəniyyət xəbərləri" },
                        new() { Language = "en", Name = "Culture", Description = "Culture news" },
                        new() { Language = "ru", Name = "Культура", Description = "Новости культуры" }
                    }
                }
            };

            db.Categories.AddRange(categories);
            await db.SaveChangesAsync();
        }

        // Seed Site Settings
        if (!await db.SiteSettings.AnyAsync())
        {
            var settings = new List<SiteSetting>
            {
                // Global settings
                new() { Key = "site_logo", Value = "/assets/logo.svg" },
                new() { Key = "site_favicon", Value = "/assets/favicon.ico" },
                new() { Key = "social_facebook", Value = "https://facebook.com/panorama" },
                new() { Key = "social_twitter", Value = "https://twitter.com/panorama" },
                new() { Key = "social_instagram", Value = "https://instagram.com/panorama" },
                new() { Key = "social_youtube", Value = "https://youtube.com/panorama" },
                new() { Key = "social_telegram", Value = "https://t.me/panorama" },

                // Language-specific settings
                new() { Key = "site_name", Value = "Panorama", Language = "az" },
                new() { Key = "site_tagline", Value = "Geniş Baxış, Dərin Analiz", Language = "az" },
                new() { Key = "site_description", Value = "Azərbaycanın ən etibarlı xəbər portalı", Language = "az" },

                new() { Key = "site_name", Value = "Panorama", Language = "en" },
                new() { Key = "site_tagline", Value = "Broad View, Deep Analysis", Language = "en" },
                new() { Key = "site_description", Value = "Azerbaijan's most trusted news portal", Language = "en" },

                new() { Key = "site_name", Value = "Панорама", Language = "ru" },
                new() { Key = "site_tagline", Value = "Широкий Взгляд, Глубокий Анализ", Language = "ru" },
                new() { Key = "site_description", Value = "Самый надежный новостной портал Азербайджана", Language = "ru" },
            };

            db.SiteSettings.AddRange(settings);
            await db.SaveChangesAsync();
        }

        // Seed Sample Articles
        if (!await db.Articles.AnyAsync())
        {
            var admin = await db.Users.FirstAsync();
            var categories = await db.Categories.ToListAsync();

            var articles = new List<Article>
            {
                new()
                {
                    CategoryId = categories[0].Id, AuthorId = admin.Id,
                    Slug = "azerbaycan-yeni-iqtisadi-islahatlar-elan-etdi",
                    IsPublished = true, IsFeatured = true, IsBreaking = true,
                    PublishedAt = DateTime.UtcNow.AddHours(-1), ViewCount = 1520,
                    Translations = new List<ArticleTranslation>
                    {
                        new() { Language = "az", Title = "Azərbaycan yeni iqtisadi islahatlar elan etdi",
                            Summary = "Prezident İlham Əliyev ölkənin iqtisadi inkişafına yönəlmiş yeni islahat paketini təqdim etdi. Paket qeyri-neft sektorunun inkişafını, texnoloji innovasiyaları və sahibkarlığın dəstəklənməsini nəzərdə tutur.",
                            Content = "<p>Prezident İlham Əliyev ölkənin iqtisadi inkişafına yönəlmiş yeni islahat paketini təqdim etdi.</p><p>Paket qeyri-neft sektorunun inkişafını, texnoloji innovasiyaları və sahibkarlığın dəstəklənməsini nəzərdə tutur. Bu islahatlar ölkənin 2030-cu ilə qədər iqtisadi diversifikasiya hədəflərinə çatmasına kömək edəcək.</p><p>Yeni islahat paketi çərçivəsində kiçik və orta sahibkarlıq üçün güzəştli kreditlər, vergi istisnalarv və texnopark infrastrukturu planlaşdırılır.</p>",
                            MetaTitle = "Azərbaycan yeni iqtisadi islahatlar elan etdi | Panorama",
                            MetaDescription = "Prezident yeni iqtisadi islahat paketini təqdim etdi" },
                        new() { Language = "en", Title = "Azerbaijan announces new economic reforms",
                            Summary = "President Ilham Aliyev presented a new reform package aimed at the country's economic development.",
                            Content = "<p>President Ilham Aliyev presented a new reform package aimed at the country's economic development.</p>" },
                        new() { Language = "ru", Title = "Азербайджан объявил о новых экономических реформах",
                            Summary = "Президент Ильхам Алиев представил новый пакет реформ для экономического развития страны.",
                            Content = "<p>Президент Ильхам Алиев представил новый пакет реформ для экономического развития страны.</p>" }
                    }
                },
                new()
                {
                    CategoryId = categories[2].Id, AuthorId = admin.Id,
                    Slug = "bmt-bas-assambleyasi-yeni-qetname-qebul-etdi",
                    IsPublished = true, IsFeatured = true,
                    PublishedAt = DateTime.UtcNow.AddHours(-3), ViewCount = 890,
                    Translations = new List<ArticleTranslation>
                    {
                        new() { Language = "az", Title = "BMT Baş Assambleyası yeni qətnamə qəbul etdi",
                            Summary = "Birləşmiş Millətlər Təşkilatının Baş Assambleyası iqlim dəyişikliyi ilə mübarizəyə dair yeni qətnamə qəbul etdi.",
                            Content = "<p>BMT Baş Assambleyası iqlim dəyişikliyi ilə mübarizə çərçivəsində yeni qətnamə qəbul etdi. Qətnamə inkişaf etməkdə olan ölkələrə maliyyə yardımının artırılmasını və yaşıl texnologiyaların transferini nəzərdə tutur.</p>" },
                        new() { Language = "en", Title = "UN General Assembly adopts new resolution",
                            Summary = "The United Nations General Assembly adopted a new resolution on combating climate change.",
                            Content = "<p>The UN General Assembly adopted a new resolution on combating climate change.</p>" },
                        new() { Language = "ru", Title = "Генеральная Ассамблея ООН приняла новую резолюцию",
                            Summary = "Генеральная Ассамблея ООН приняла новую резолюцию по борьбе с изменением климата.",
                            Content = "<p>Генеральная Ассамблея ООН приняла новую резолюцию по борьбе с изменением климата.</p>" }
                    }
                },
                new()
                {
                    CategoryId = categories[4].Id, AuthorId = admin.Id,
                    Slug = "suni-intellekt-sahesinde-yeni-sirf-acildi",
                    IsPublished = true, IsFeatured = true,
                    PublishedAt = DateTime.UtcNow.AddHours(-5), ViewCount = 2340,
                    Translations = new List<ArticleTranslation>
                    {
                        new() { Language = "az", Title = "Süni intellekt sahəsində yeni sırf açıldı",
                            Summary = "Google DeepMind yeni nəsil AI modeli təqdim etdi. Model insan səviyyəsində mürəkkəb məsələləri həll edə bilir.",
                            Content = "<p>Google DeepMind şirkəti yeni nəsil süni intellekt modelini təqdim etdi. Bu model əvvəlki versiyalardan fərqli olaraq çoxsahəli düşüncə qabiliyyətinə malikdir.</p><p>Yeni model tibb, hüquq və mühəndislik sahələrində insan ekspertləri ilə müqayisə oluna biləcək nəticələr göstərir.</p>" },
                        new() { Language = "en", Title = "New breakthrough in artificial intelligence",
                            Summary = "Google DeepMind introduced a new generation AI model capable of solving complex problems at human level.",
                            Content = "<p>Google DeepMind introduced a new generation AI model.</p>" },
                        new() { Language = "ru", Title = "Новый прорыв в области искусственного интеллекта",
                            Summary = "Google DeepMind представил модель ИИ нового поколения.",
                            Content = "<p>Google DeepMind представил модель ИИ нового поколения.</p>" }
                    }
                },
                new()
                {
                    CategoryId = categories[3].Id, AuthorId = admin.Id,
                    Slug = "qarabag-fk-championsleague-qrup-merhelesine-yukseldidot",
                    IsPublished = true, IsBreaking = true,
                    PublishedAt = DateTime.UtcNow.AddHours(-2), ViewCount = 4200,
                    Translations = new List<ArticleTranslation>
                    {
                        new() { Language = "az", Title = "Qarabağ FK Çempionlar Liqası qrup mərhələsinə yüksəldi",
                            Summary = "Qarabağ FK tarixi qələbə ilə UEFA Çempionlar Liqası qrup mərhələsinə vəsiqə qazandı.",
                            Content = "<p>Qarabağ FK tarixi qələbə ilə UEFA Çempionlar Liqası qrup mərhələsinə vəsiqə qazandı. Komanda play-off mərhələsində güclü rəqibini məğlub edərək Azərbaycan futbol tarixinə yeni səhifə yazdı.</p>" },
                        new() { Language = "en", Title = "Qarabag FK qualifies for Champions League group stage",
                            Summary = "Qarabag FK secured a historic victory to qualify for the UEFA Champions League group stage.",
                            Content = "<p>Qarabag FK secured a historic victory.</p>" },
                        new() { Language = "ru", Title = "ФК Карабах вышел в групповой этап Лиги Чемпионов",
                            Summary = "ФК Карабах одержал историческую победу и вышел в групповой этап Лиги Чемпионов УЕФА.",
                            Content = "<p>ФК Карабах одержал историческую победу.</p>" }
                    }
                },
                new()
                {
                    CategoryId = categories[1].Id, AuthorId = admin.Id,
                    Slug = "neft-qiymeti-yeni-rekor-seviyyeye-catdi",
                    IsPublished = true,
                    PublishedAt = DateTime.UtcNow.AddHours(-6), ViewCount = 670,
                    Translations = new List<ArticleTranslation>
                    {
                        new() { Language = "az", Title = "Neft qiyməti yeni rekord səviyyəyə çatdı",
                            Summary = "Brent markalı neftin qiyməti barrelə 95 dollara yüksəldi. Ekspertlər qiymət artımının geopolitik gərginliklərlə əlaqədar olduğunu bildirir.",
                            Content = "<p>Brent markalı neftin qiyməti barrelə 95 dollara yüksəldi. Bu, son iki ilin ən yüksək göstəricisidir.</p>" },
                        new() { Language = "en", Title = "Oil prices reach new record levels",
                            Summary = "Brent crude oil price rose to $95 per barrel.",
                            Content = "<p>Brent crude oil price rose to $95 per barrel.</p>" },
                        new() { Language = "ru", Title = "Цена на нефть достигла нового рекордного уровня",
                            Summary = "Цена на нефть марки Brent выросла до $95 за баррель.",
                            Content = "<p>Цена на нефть марки Brent выросла до $95 за баррель.</p>" }
                    }
                },
                new()
                {
                    CategoryId = categories[5].Id, AuthorId = admin.Id,
                    Slug = "baki-beynelxalq-musiqi-festivalina-ev-sahibliyi-edir",
                    IsPublished = true,
                    PublishedAt = DateTime.UtcNow.AddHours(-8), ViewCount = 430,
                    Translations = new List<ArticleTranslation>
                    {
                        new() { Language = "az", Title = "Bakı beynəlxalq musiqi festivalına ev sahibliyi edir",
                            Summary = "Bakıda keçirilən beynəlxalq musiqi festivalı dünya şöhrətli sənətçiləri bir araya gətirir.",
                            Content = "<p>Bakıda keçirilən beynəlxalq musiqi festivalı dünya şöhrətli sənətçiləri bir araya gətirir. Festival çərçivəsində klassik musiqi, caz və muğam konsertləri planlaşdırılır.</p>" },
                        new() { Language = "en", Title = "Baku hosts international music festival",
                            Summary = "The international music festival held in Baku brings together world-renowned artists.",
                            Content = "<p>The international music festival held in Baku brings together world-renowned artists.</p>" },
                        new() { Language = "ru", Title = "Баку принимает международный музыкальный фестиваль",
                            Summary = "Международный музыкальный фестиваль в Баку собирает всемирно известных артистов.",
                            Content = "<p>Международный музыкальный фестиваль в Баку собирает всемирно известных артистов.</p>" }
                    }
                }
            };

            db.Articles.AddRange(articles);
            await db.SaveChangesAsync();
        }
    }
}
