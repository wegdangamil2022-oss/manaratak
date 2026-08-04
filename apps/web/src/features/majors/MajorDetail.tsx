import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiClient, PublicMajorDto } from '../../api/client';
import { Button } from '@manaratak/ui';
import { RelatedPublicLinks } from '../../components/RelatedPublicLinks';
import { Seo } from '../../components/Seo';
import { useTranslation } from "../../i18n/I18nProvider";

function renderStringList(items?: string[], emptyLabel = 'Not available') {
  if (!items || items.length === 0) {
    return <p className="text-gray-500">{emptyLabel}</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((item, index) => (
        <li key={index} className="rounded-xl border bg-gray-50 p-4 leading-7 text-gray-700">
          {item}
        </li>
      ))}
    </ul>
  );
}

function normalizeRelated(value?: string | string[]) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function MajorDetail() {
    const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<PublicMajorDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMajor = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const result = await ApiClient.getMajorBySlug(slug);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error fetching major');
      } finally {
        setLoading(false);
      }
    };

    fetchMajor();
  }, [slug]);

  if (loading) {
    return <div className="py-20 text-center text-gray-500">{t('loading_major_details')}</div>;
  }

  if (error || !data) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('major_not_found')}</h2>
        <p className="text-gray-600 mb-6">{error || "The major you are looking for doesn't exist or is not published."}</p>
        <Button asChild>
          <Link to="/majors">{t('browse_all_majors')}</Link>
        </Button>
      </div>
    );
  }

  const relatedMajors = normalizeRelated(data.relatedMajors);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Seo title={data.displayName} description={data.studentFriendlySummary || data.description || `${data.displayName} major details, skills, careers, and study pathway.`} />
      <Link to="/majors" className="mb-4 inline-block text-sm font-bold text-blue-700 hover:underline">
        {t('lt_back_to_majors')}</Link>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b bg-gradient-to-br from-violet-50 to-white p-5 sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700">{t('major_details')}</p>
          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">{data.displayName}</h1>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-violet-600 px-3 py-2 font-bold text-white shadow-sm">{data.degreeLevel}</span>
            {data.academicFieldOrDiscipline && (
              <span className="rounded-full bg-white px-3 py-2 font-bold shadow-sm">{data.academicFieldOrDiscipline}</span>
            )}
            {data.collegeOrFaculty && (
              <span className="rounded-full bg-white px-3 py-2 font-bold shadow-sm">{data.collegeOrFaculty}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-3 lg:p-8">
          <div className="space-y-5 lg:col-span-2">
            <section className="rounded-2xl border bg-white p-5">
              <h2 className="text-xl font-bold mb-3">{t('overview')}</h2>
              <p className="whitespace-pre-wrap text-base leading-8 text-gray-700">
                {data.studentFriendlySummary || data.description || `${data.displayName} is a ${data.degreeLevel} study pathway in ${data.academicFieldOrDiscipline || 'its academic field'}.`}
              </p>
            </section>

            <section className="rounded-2xl border bg-white p-5">
              <h2 className="text-xl font-bold mb-3">{t('skills_you_may_build')}</h2>
              {renderStringList(data.acquiredSkills, 'Skill information is not available yet.')}
            </section>

            <section className="rounded-2xl border bg-white p-5">
              <h2 className="text-xl font-bold mb-3">{t('career_outcomes')}</h2>
              {renderStringList(data.careerOutcomes, 'Career outcome information is not available yet.')}
            </section>

            <section className="rounded-2xl border bg-white p-5">
              <h2 className="text-xl font-bold mb-3">{t('typical_courses')}</h2>
              {renderStringList(data.typicalCourses, 'Typical course information is not available yet.')}
            </section>

            {relatedMajors.length > 0 && (
              <section className="rounded-2xl border bg-white p-5">
                <h2 className="text-xl font-bold mb-3">{t('related_majors')}</h2>
                <div className="flex flex-wrap gap-2">
                  {relatedMajors.map((major, index) => (
                    <span key={index} className="rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
                      {major}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="order-first space-y-6 lg:order-none">
            <div className="rounded-2xl border bg-gray-50 p-5 lg:p-6">
              <h3 className="font-bold text-lg mb-4">{t('summary')}</h3>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">{t('degree_level')}</dt>
                  <dd className="font-medium">{data.degreeLevel}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">{t('classification_system')}</dt>
                  <dd className="font-medium">{data.sourceClassificationSystem}</dd>
                </div>
                {data.classificationCode && (
                  <div>
                    <dt className="text-gray-500">{t('classification_code')}</dt>
                    <dd className="font-medium">{data.classificationCode}</dd>
                  </div>
                )}
                {data.academicFieldOrDiscipline && (
                  <div>
                    <dt className="text-gray-500">{t('field_discipline')}</dt>
                    <dd className="font-medium">{data.academicFieldOrDiscipline}</dd>
                  </div>
                )}
                {data.collegeOrFaculty && (
                  <div>
                    <dt className="text-gray-500">{t('college_faculty')}</dt>
                    <dd className="font-medium">{data.collegeOrFaculty}</dd>
                  </div>
                )}
              </dl>

              {(data.officialSourceUrl || data.sourceUrl) && (
                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline" asChild className="w-full">
                    <a href={data.officialSourceUrl || data.sourceUrl || '#'} target="_blank" rel="noopener noreferrer">
                      {t('view_source')}</a>
                  </Button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
      <RelatedPublicLinks current="majors" />
    </div>
  );
}
